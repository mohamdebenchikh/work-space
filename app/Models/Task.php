<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $table = 'tasks';
    protected $fillable = [
        'title', 'description', 'slug', 'project_id','user_id','team_id',
        'notes','due_date','priority','status','started_at','completed_at',
        'progress','order'
    ];


    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public function assignedUsers()
    {
        return $this->belongsToMany(User::class)
            ->withPivot('assigned_by')
            ->withTimestamps()
            ->using(TaskUser::class);
    }
}
