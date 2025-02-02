<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TaskPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // Allow viewing tasks if the user belongs to the current team
        return $user->currentTeam !== null;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Task $task): bool
    {
        // Allow viewing if the task belongs to the user's current team
        return $task->team_id === $user->currentTeam?->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Allow task creation if the user belongs to a team
        return $user->currentTeam !== null;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Task $task): bool
    {
        // Allow update if:
        // 1. The task belongs to the user's current team, AND
        // 2. The user is the task creator or an admin/owner of the team
        return $task->team_id === $user->currentTeam?->id &&
            ($task->user_id === $user->id || $user->currentTeam->isOwnerOrAdmin($user));
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Task $task): bool
    {
        // Allow deletion if:
        // 1. The task belongs to the user's current team, AND
        // 2. The user is the task creator or an admin/owner of the team
        return $task->team_id === $user->currentTeam?->id &&
            ($task->user_id === $user->id || $user->currentTeam->isOwnerOrAdmin($user));
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Task $task): bool
    {
        // Allow restoration if:
        // 1. The task belongs to the user's current team, AND
        // 2. The user is the task creator or an admin/owner of the team
        return $task->team_id === $user->currentTeam?->id &&
            ($task->user_id === $user->id || $user->currentTeam->isOwnerOrAdmin($user));
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Task $task): bool
    {
        // Allow permanent deletion if:
        // 1. The task belongs to the user's current team, AND
        // 2. The user is an admin/owner of the team
        return $task->team_id === $user->currentTeam?->id &&
            $user->currentTeam->isOwnerOrAdmin($user);
    }


    public function assign(User $user, Task $task)
    {
        return $task->team_id === $user->currentTeam->id &&
            ($user->id === $task->user_id ||
                $user->currentTeam->isAdminOrOwner($user));
    }
}
