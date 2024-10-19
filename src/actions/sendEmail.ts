

import { Resend } from 'resend';
import { Buffer } from 'buffer';

const resend = new Resend('re_PUQj653M_Btbxy9YvPan6Ly1tZcSroYbJ'); // Ersetze mit deinem Resend API Key

export async function sendEmail(email: string, subject: string, body: string) {
  try {
    // Konvertiere die Audiodatei in Base64
    // Sende die E-Mail mit Anhang
    await resend.emails.send({
      from: 'tony@tonyjoke.com',
      to: [email],
      subject: subject,
      html: body,
    });
  } catch (error) {
    throw new Error('Failed to send email');
  }
}
