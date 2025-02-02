<?php

namespace App\Mail;

use App\Models\TeamInvitation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TeamInvitationMail extends Mailable
{
    use Queueable, SerializesModels;


    public $isResend = false;
    public $invitation;

    /**
     * Create a new message instance.
     *
     * @param TeamInvitation $invitation
     */
    public function __construct(TeamInvitation $invitation, bool $isResend = false)
    {
        $this->invitation = $invitation;
        $this->isResend = $isResend;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->isResend ? 'You have been re-invited to join ' . $this->invitation->team->name : 'You have been invited to join ' . $this->invitation->team->name,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.team-invitation',
            with: [
                'team' => $this->invitation->team,
                'invitation' => $this->invitation,
                'acceptUrl' => route('register', ['invitation_token' => $this->invitation->accept_token]),
                'rejectUrl' => route('team.invitations.reject', $this->invitation->reject_token),
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array
     */
    public function attachments(): array
    {
        return [];
    }
}

