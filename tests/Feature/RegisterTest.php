<?php

namespace Tests\Feature;

use App\Models\Team;
use App\Models\TeamInvitation;
use App\Models\User;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class RegisterTest extends TestCase
{
    public function test_registration_page_is_displayed()
    {
        // Make a GET request to the /register page
        $response = $this->get('/register');

        // Assert that the response has the correct inertia component
        $response->assertInertia(
            fn(AssertableInertia $page) =>
            $page->component('Auth/Register')
                ->has('invitation_token')
        );
    }


    public function test_user_can_register_successfully()
    {
        $userData = [
            'name' => 'Test User',
            'email' => 'testuser@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ];

        // Send a POST request to the registration endpoint
        $response = $this->post('/register', $userData);

        // Assert that the user is redirected to the dashboard
        $response->assertRedirect(route('dashboard'));

        // Assert that the user is created in the database
        $this->assertDatabaseHas('users', [
            'email' => 'testuser@example.com',
        ]);
    }


    public function test_user_can_register_with_an_invitation_token()
    {
        $teamOwner = User::factory()->create();
        // Create a team
        $team = Team::create([
            'name' => 'Test Team',
            'owner_id' => $teamOwner->id,
        ]);

        // Create a team invitation
        $invitation = TeamInvitation::create([
            'email' => 'testuser@example.com',
            'role' => 'member',
            'user_id' => $teamOwner->id,
            'accept_token' => 'valid-token',
            'reject_token' => 'invalid-token',
            'status' => 'pending',
            'team_id' => $team->id,
        ]);

        $userData = [
            'name' => 'Test User',
            'email' => 'testuser@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'invitation_token' => 'valid-token',
        ];

        // Send a POST request to the registration endpoint with the invitation token
        $response = $this->post('/register', $userData);

        // Assert that the user is redirected to the dashboard
        $response->assertRedirect(route('dashboard'));

        // Assert that the user is created in the database
        $this->assertDatabaseHas('users', [
            'email' => 'testuser@example.com',
        ]);

        // Assert that the user is added to the team
        $this->assertDatabaseHas('team_user', [
            'user_id' => User::where('email', 'testuser@example.com')->first()->id,
            'team_id' => $invitation->team_id,
        ]);
    }
}
