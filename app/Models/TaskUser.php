<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class TaskUser extends Pivot
{
    protected $table = 'task_user';
    protected $fillable = ['task_id', 'user_id', 'assigned_by'];
    
    public function assigner()
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }
}
