<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Team;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class TeamController extends Controller
{
    /**
     * Display a listing of the user's teams.
     */
    public function index()
    {
        $teams = auth()->user()->teams;
            
        $teams->each(function ($team) {
            // Access the already loaded members collection
            $team->currentUserRole = $team->members
                ->find(auth()->id()) // Use collection's find method
                ->pivot
                ->role;
        });

        return Inertia::render('Teams/Index', [
            'teams' => $teams
        ]);
    }

    /**
     * Show the form for creating a new team.
     */
    public function create()
    {
        return Inertia::render('Teams/Create');
    }

    /**
     * Store a newly created team in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
        ]);

        $team = $request->user()->ownedTeams()->create($validated);

        // Automatically add the creator as the owner
        $team->members()->attach($request->user()->id, ['role' => 'owner']);

        return redirect()
            ->route('teams.edit', $team)
            ->with('success', 'Team created successfully!');
    }

    /**
     * Display the specified team.
     */
    public function show(Team $team)
    {
        Gate::authorize('view', $team);

        $team->load(['members', 'pendingInvitations']);
        $team->currentUserRole = $team->members()->find(auth()->id())->pivot->role;

        return Inertia::render('Teams/Show', [
            'team' => $team
        ]);
    }

    /**
     * Show the form for editing the specified team.
     */
    public function edit(Team $team)
    {
        Gate::authorize('manage-team', $team);

        $team->load(['members', 'pendingInvitations.user']);
        $team->currentUserRole = $team->members()->find(auth()->id())->pivot->role;

        return Inertia::render('Teams/Edit', [
            'team' => $team,
            'invitations' => $team->pendingInvitations
        ]);
    }

    /**
     * Update the specified team in storage.
     */
    public function update(Request $request, Team $team)
    {
        Gate::authorize('manage-team', $team);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
        ]);

        $team->update($validated);

        return redirect()
            ->route('teams.edit', $team)
            ->with('success', 'Team updated successfully!');
    }

    /**
     * Remove the specified team from storage.
     */
    public function destroy(Team $team)
    {
        Gate::authorize('delete', $team);

        $team->delete();

        return redirect()
            ->route('teams.index')
            ->with('success', 'Team deleted successfully!');
    }
}
