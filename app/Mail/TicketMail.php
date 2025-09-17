<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TicketMail extends Mailable
{
    use Queueable, SerializesModels;
    public $mailData;
    /**
     * Create a new message instance.
     */
    public function __construct($mailData)
    {
        $this->mailData = $mailData;
    }
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->mailData['subject'],
        );
    }
    public function content(): Content
    {
        return new Content(
            view: 'emails.ticketMail',
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
    /**
     * Build the message.
     */
    // public function build()
    // {
    //     return $this->subject($this->mailData['subject'])
    //         ->view('emails.ticketMail')
    //         ->from($this->mailData['fromEmail'])
    //         ->replyTo($this->mailData['replyTo']);
    // }
    // public function build()
    // {
    //     $fromEmail = $this->mailData['fromEmail'] ?? 'vm@thetranslationgate.com';
    //     $replyTo   = $this->mailData['replyTo'] ?? $fromEmail;

    //     return $this->subject($this->mailData['subject'])
    //         ->view('emails.ticketMail')
    //         ->from($fromEmail)
    //         ->replyTo($replyTo);
    // }
}
