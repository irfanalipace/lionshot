<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ForgetPasswordOTP extends Mailable
{
    use Queueable, SerializesModels;
    protected User $user;
    public int $otp;
    public string $full_name;
    /**
     * Create a new message instance.
     */
    public function __construct(User $user, int $otp)
    {
        $this->user = $user;
        $this->full_name = ucfirst($this->user->first_name.' '.$this->user->last_name);
        $this->otp = $otp;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Forget Password O T P',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'auth.passwords.forget-password-otp',
            with: [
                'fullName' => $this->full_name,
                'otp' => $this->otp
            ]
        );
    }

    /**
     * Get the notification's channels.
     *
     * @param  mixed  $notifiable
     * @return array|string
     */
    public function via($notifiable)
    {
        return ['mail'];
    }


}
