<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Notifications\DatabaseNotification;

class NotificationController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        return Inertia::render('Notifications/Index', [
            'unreadNotifications' => $user->unreadNotifications()
                ->latest()
                ->get(),
            'readNotifications' => $user->readNotifications()
                ->latest()
                ->get()
        ]);
    }

    public function markAsRead(string $id)
    {
        $notification = DatabaseNotification::findOrFail($id);
        
        $notification->markAsRead();

        return redirect()->back()->with('success', 'Notification marked as read');
    }

    public function markAllAsRead()
    {
        auth()->user()->unreadNotifications->markAsRead();

        return redirect()->back()->with('success', 'All notifications marked as read');
    }

    public function destroy(string $id)
    {
        $notification = DatabaseNotification::findOrFail($id);
        
        $notification->delete();

        return redirect()->back()->with('success', 'Notification deleted');
    }

    public function destroyAll(Request $request)
    {
        $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => [
                'required',
                'string',
                'exists:notifications,id',
                function ($attribute, $value, $fail) {
                    if (!auth()->user()->notifications()->where('id', $value)->exists()) {
                        $fail('One or more notifications do not belong to the user');
                    }
                }
            ]
        ]);

        auth()->user()->notifications()->whereIn('id', $request->ids)->delete();

        return redirect()->back()->with('success', 'Selected notifications deleted');
    }
}