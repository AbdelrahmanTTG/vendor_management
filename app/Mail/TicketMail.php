<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Address;

class TicketMail extends Mailable
{
    use Queueable, SerializesModels;
    public $mailData;
    protected $fromAddress;
    protected $fromName;

    public function __construct($mailData, $fromAddress = null, $fromName = null)
    {
        $this->mailData = $mailData;
        $this->fromAddress = $fromAddress;
        $this->fromName = $fromName;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            from: $this->fromAddress
                ? new Address($this->fromAddress, $this->fromName ?? '')
                : null,
            subject: $this->mailData['subject'],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.ticketMail',
            with: ['mailData' => $this->mailData],
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
