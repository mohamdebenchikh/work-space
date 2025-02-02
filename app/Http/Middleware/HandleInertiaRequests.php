<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = null;
        $currentTeam = null;
        $teams = [];
        $unreadNotifications = [];

        if ($request->user()) {
            $unreadNotifications = $request->user()->unreadNotifications;
            $user = $request->user();
            $currentTeam = $request->user()->currentTeam;
            $currentTeam->currentUserRole = $request->user()->teams()->find($request->user()->current_team_id)->pivot->role ?? null;
            $teams = $request->user()->teams;

            $teams->map(function ($team) use ($request) {
                $team->currentUserRole = $request->user()->teams()->find($team->id)->pivot->role ?? null;
            });
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
                'currentTeam' => $currentTeam,
                'teams' => $teams,
                'unreadNotifications' => $unreadNotifications
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ]
        ];
    }
}
