<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeamInvitation extends Model
{

    protected $table = 'team_invitations';

    protected $fillable = [
        'team_id',
        'user_id',
        'email',
        'role',
        'accept_token',
        'reject_token',
        'accepted_at',
        'rejected_at',
        'message',
        'status',
    ];

    protected $dates = [
        'accepted_at',
        'rejected_at',
    ];

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
