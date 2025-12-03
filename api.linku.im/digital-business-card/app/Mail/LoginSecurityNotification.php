<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class LoginSecurityNotification extends Mailable
{
    use Queueable, SerializesModels;

    public string $userName;
    public string $loginTime;
    public string $ipAddress;
    public string $userAgent;

    /**
     * Create a new message instance.
     */
    public function __construct(string $userName, string $loginTime, string $ipAddress, string $userAgent)
    {
        $this->userName = $userName;
        $this->loginTime = $loginTime;
        $this->ipAddress = $ipAddress;
        $this->userAgent = $userAgent;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'ورود جدید به حساب کاربری لینکو - Linku Login Alert',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.login-notification',
            with: [
                'userName' => $this->userName,
                'loginTime' => $this->loginTime,
                'ipAddress' => $this->ipAddress,
                'userAgent' => $this->userAgent,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
