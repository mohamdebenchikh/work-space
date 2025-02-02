<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\TeamInvitation;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(Request $request): Response
    {
        $invitation_token = $request->invitation_token ?? null;
        return Inertia::render('Auth/Register', [
            'invitation_token' => $invitation_token
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'invitation_token' => ['nullable', 'string', 'exists:team_invitations,accept_token']
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        if ($request->invitation_token) {

            $invitation = TeamInvitation::with('team')
                ->where('status', 'pending')
                ->where('accept_token', $request->invitation_token)
                ->firstOrFail();
            $invitation->team->members()->attach($user, ['role' => $invitation->role]);

            $invitation->update([
                'accepted_at' => now(),
                'accept_token' => null,
                'reject_token' => null,
                'status' => 'accepted',
            ]);

            $user->switchTeam($invitation->team);
        } else {
            $firstName = explode(' ', $request->name)[0];
            $teamName = $firstName . "'s Team";
            $teamDescription = $firstName . "'s Team Description";

            $team = $user->ownedTeams()->create([
                'name' => $teamName,
                'description' => $teamDescription,
            ]);

            $team->members()->attach($user, ['role' => 'owner']);

            $user->switchTeam($team);
        }

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
