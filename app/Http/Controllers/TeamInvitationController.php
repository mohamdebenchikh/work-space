<?php

namespace App\Http\Controllers;

use App\Mail\TeamInvitationMail;
use App\Models\Team;
use App\Models\TeamInvitation;
use App\Models\User;
use App\Notifications\TeamInvitationNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TeamInvitationController extends Controller
{
    public function index(Team $team)
    {
        Gate::authorize('manage-team', $team);

        $invitations = $team->invitations()
            ->with(['user', 'team'])
            ->where('status', 'pending')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Teams/Invitations', [
            'team' => $team,
            'invitations' => $invitations
        ]);
    }

    public function store(Request $request, Team $team)
    {
        Gate::authorize('manage-team', $team);

        $request->validate([
            'email' => 'required|email|max:255',
            'role' => 'required|in:admin,member',
            'message' => 'nullable|string|max:500',
        ]);

        $email = $request->email;

        // Check for existing invitations
        if ($team->hasPendingInvitation($email)) {
            return back()->withErrors(['email' => 'This email has already been invited to the team.']);
        }

        // Check if user is already a member
        if ($team->hasMember($email)) {
            return back()->withErrors(['email' => 'This user is already a team member.']);
        }

        $invitation = $this->createInvitation($team, $request->all());
        $this->sendInvitation($invitation);

        return back()->with('success', 'Invitation sent successfully!');
    }

    public function show(TeamInvitation $invitation)
    {
        if (auth()->user()->email !== $invitation->email) {
            abort(403);
        }

        $invitation->load('team', 'user');

        return Inertia::render('Teams/ShowInvitation', [
            'invitation' => $invitation->load('team'),
        ]);
    }

    public function accept($token)
    {
        $invitation = TeamInvitation::with('team')
            ->where('accept_token', $token)
            ->firstOrFail();

        if ($invitation->status !== 'pending') {
            return redirect()->route('dashboard')->with('error', 'Invitation already processed.');
        }

        $user = User::where('email', $invitation->email)->first();

        if (!$user) {
            return redirect()->route('register', ['invitation' => $token]);
        }

        // Check if user is already a member
        if ($invitation->team->hasMember($user)) {
            $invitation->delete();
            return redirect()->route('dashboard')
                ->with('error', 'You are already a member of this team.');
        }

        DB::transaction(function () use ($invitation, $user) {
            $invitation->team->members()->attach($user, ['role' => $invitation->role]);
            $invitation->update([
                'accepted_at' => now(),
                'reject_token' => null,
                'accept_token' => null,
                'status' => 'accepted',
            ]);
        });

        $this->readNotification($invitation);

        return redirect()->back()
            ->with('success', 'Successfully joined the team!');
    }

    public function reject($token)
    {
        $invitation = TeamInvitation::where('reject_token', $token)
            ->firstOrFail();

        $invitation->update([
            'rejected_at' => now(),
            'status' => 'rejected',
            'accept_token' => null,
            'reject_token' => null,
        ]);

        $this->readNotification($invitation);

        return redirect()->back()->with('success', 'Invitation rejected successfully.');
    }

    public function destroy(Team $team, TeamInvitation $invitation)
    {
        Gate::authorize('manage-team', $team);

        if ($invitation->team_id !== $team->id) {
            abort(403);
        }

        $invitation->delete();

        return back()->with('success', 'Invitation deleted successfully.');
    }

    protected function createInvitation(Team $team, array $data): TeamInvitation
    {
        return $team->invitations()->create([
            'user_id' => auth()->id(),
            'email' => $data['email'],
            'role' => $data['role'],
            'message' => $data['message'] ?? null,
            'accept_token' => Str::random(60),
            'reject_token' => Str::random(60),
        ]);
    }

    protected function sendInvitation(TeamInvitation $invitation)
    {
        $user = User::where('email', $invitation->email)->first();

        if ($user) {
            $user->notify(new TeamInvitationNotification($invitation));
        } else {
            Mail::to($invitation->email)
                ->send(new TeamInvitationMail($invitation));
        }
    }


    protected function readNotification(TeamInvitation $invitation)
    {
        DB::transaction(function () use ($invitation) {
            $notification = auth()->user()->notifications()
                ->where('data->type', 'team_invitation')
                ->where('data->invitation_id', $invitation->id)
                ->first();

            if ($notification) {
                $notification->markAsRead();
            }
        });
    }
}
