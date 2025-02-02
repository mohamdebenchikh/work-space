<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;

class TeamMemberController extends Controller
{
    public function index(Team $team)
    {
        $members = $team->members()->get();

        return Inertia::render('Teams/Members', [
            'team' => $team,
            'members' => $members
        ]);
    }


    // In TeamMemberController

    public function update(Request $request, Team $team, User $user)
    {
        Gate::authorize('manage-team', $team);

        $request->validate(['role' => 'required|in:member,admin']);

        $team->members()->updateExistingPivot($user->id, [
            'role' => $request->role
        ]);

        return back()->with('success', 'Role updated successfully');
    }

    public function destroy(Team $team, User $user)
    {
        Gate::authorize('manage-team', [$team, $user]);

        $team->members()->detach($user->id);

        return back()->with('success', 'Member removed successfully');
    }
}
