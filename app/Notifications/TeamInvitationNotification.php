<?php

namespace App\Notifications;

use App\Models\TeamInvitation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TeamInvitationNotification extends Notification
{
    use Queueable;

    public TeamInvitation $invitation;

    /**
     * Create a new notification instance.
     */
    public function __construct(TeamInvitation $invitation)
    {
        $this->invitation = $invitation;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('You have been invited to join a team')
            ->greeting('Hello!')
            ->line('You have been invited to join the team: ' . $this->invitation->team->name)
            ->line('Role: ' . $this->invitation->role)
            ->line($this->invitation->message ? 'Message: ' . $this->invitation->message : '')
            ->action('Accept Invitation', route('team.invitations.accept', ['token' => $this->invitation->accept_token]) ?: url('/'))
            ->action('Reject Invitation', route('team.invitations.reject', ['token' => $this->invitation->reject_token]) ?: url('/'))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Team Invitation',
            'type' => 'team_invitation',
            'invitation_id' => $this->invitation->id,
            'message' => 'You have been invited to join the team: ' . $this->invitation->team->name,
            'accept_url' => route('team.invitations.accept', ['token' => $this->invitation->accept_token]),
            'reject_url' => route('team.invitations.reject', ['token' => $this->invitation->reject_token]),
        ];
    }
}

