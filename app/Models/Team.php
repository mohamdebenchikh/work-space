<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Collection;

class Team extends Model
{
    protected $fillable = [
        'owner_id', 
        'name', 
        'description'
    ];

    // Relationships
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'team_users','team_id', 'user_id')
            ->withPivot('role')
            ->withTimestamps();
    }

    public function invitations(): HasMany
    {
        return $this->hasMany(TeamInvitation::class);
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    public function pages(): HasMany
    {
        return $this->hasMany(Page::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }


    // Scopes
    public function scopePendingInvitations($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeAcceptedInvitations($query)
    {
        return $query->where('status', 'accepted');
    }

    public function scopeRejectedInvitations($query)
    {
        return $query->where('status', 'rejected');
    }

    // Helper Methods
    public function hasPendingInvitation(string $email): bool
    {
        return $this->invitations()
            ->where('email', $email)
            ->whereNull('accepted_at')
            ->whereNull('rejected_at')
            ->exists();
    }

    public function hasMember(User|string $user): bool
    {
        if ($user instanceof User) {
            return $this->members()->where('user_id', $user->id)->exists();
        }
        return $this->members()->where('email', $user)->exists();
    }

    public function isAdmin(User $user): bool
    {
        return $this->members()
            ->where('user_id', $user->id)
            ->where('role', 'admin')
            ->exists();
    }

    public function isOwner(User $user): bool
    {
        return $this->owner_id === $user->id;
    }

    public function isOwnerOrAdmin(User $user): bool
    {
        return $this->isOwner($user) || $this->isAdmin($user);
    }

    public function pendingInvitations(): Collection
    {
        return $this->invitations()->where('status', 'pending')->get();
    }

    public function acceptedInvitations(): Collection
    {
        return $this->invitations()->where('status', 'accepted')->get();
    }

    public function rejectedInvitations(): Collection
    {
        return $this->invitations()->where('status', 'rejected')->get();
    }
}