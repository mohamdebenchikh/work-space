<?php

namespace App\Policies;

use App\Models\Team;
use App\Models\User;

class TeamPolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Team $team): bool
    {
        return $user->teams()->where('team_id', $team->id)->exists();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function manageTeam(User $user, Team $team): bool
    {
        return $user->teams()
            ->where('team_id', $team->id)
            ->wherePivotIn('role', ['admin', 'owner'])
            ->exists();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Team $team): bool
    {
        return $user->ownedTeams()->where('id', $team->id)->exists();
    }
}
