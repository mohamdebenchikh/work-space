<?php

use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\TeamInvitationController;
use App\Http\Controllers\TeamMemberController;
use App\Models\Project;
use App\Models\TeamInvitation;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => app()->version(),
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/profile/photo', [ProfileController::class, 'updatePhoto'])->name('profile.photo.update');

    Route::resource('teams', TeamController::class);

    Route::get('/teams-invitations/{invitation}', [TeamInvitationController::class, 'show'])->name('team.invitations.show');
    Route::get('/team/{team}/invitations', [TeamInvitationController::class, 'index'])->name('team.invitations.index');
    Route::post('/team/{team}/invitations', [TeamInvitationController::class, 'store'])->name('team.invitations.store');
    Route::get('/team-invitations/accept/{token}', [TeamInvitationController::class, 'accept'])->name('team.invitations.accept');
    Route::get('/team-invitations/reject/{token}', [TeamInvitationController::class, 'reject'])->name('team.invitations.reject');
    
    Route::delete('/team/{team}/invitations/{invitation}', [TeamInvitationController::class, 'destroy'])->name('team.invitations.destroy');
    
    
    // Members
    Route::get('/team/{team}/members', [TeamMemberController::class, 'index'])->name('team.members.index');

    // Update member role
    Route::patch('/teams/{team}/members/{user}', [TeamMemberController::class, 'update'])
        ->name('team.members.update');

    // Remove member
    Route::delete('/teams/{team}/members/{user}', [TeamMemberController::class, 'destroy'])
        ->name('team.members.destroy');
        
    // Leave team
    Route::delete('/teams/{team}/members/leave', [TeamMemberController::class, 'leave'])
        ->name('team.members.leave');


    // notifications routes
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::patch('/notifications/{notification}/mark-as-read', [NotificationController::class, 'markAsRead'])->name('notifications.mark-as-read');
    Route::patch('/notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-as-read');
    Route::patch('/notifications/mark-all-as-unread', [NotificationController::class, 'markAllAsUnread'])->name('notifications.mark-all-as-unread');
    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy'])->name('notifications.destroy');
    Route::delete('/notifications', [NotificationController::class, 'destroyAll'])->name('notifications.destroy-all');

    Route::resource('projects',ProjectController::class);
    Route::resource('pages',PageController::class);
    Route::resource('tasks',TaskController::class);
    
});

require __DIR__ . '/auth.php';
