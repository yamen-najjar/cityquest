import 'server-only';

// One place that sends email. In development it posts to the local Mailpit (same catcher the magic
// links use); in production it posts to a provider (Resend) when its key is set. With neither
// configured, sending is simply unavailable and callers degrade gracefully — the site never 500s.

export function isEmailConfigured(): boolean {
  return !!(process.env.RESEND_API_KEY || process.env.MAILPIT_SEND_URL);
}

function fromAddress(): { full: string; email: string; name: string } {
  const full = process.env.NEWSLETTER_FROM || 'CityQuest <newsletter@cityquest.local>';
  const email = full.match(/<([^>]+)>/)?.[1] ?? full;
  const name = full.replace(/<[^>]*>/, '').trim() || 'CityQuest';
  return { full, email, name };
}

export async function sendEmail({ to, subject, html, text }: { to: string; subject: string; html: string; text?: string }): Promise<{ ok: boolean }> {
  const from = fromAddress();
  try {
    if (process.env.RESEND_API_KEY) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: from.full, to, subject, html, text }),
      });
      return { ok: res.ok };
    }
    const mailpit = process.env.MAILPIT_SEND_URL;
    if (mailpit) {
      const res = await fetch(`${mailpit.replace(/\/$/, '')}/api/v1/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ From: { Email: from.email, Name: from.name }, To: [{ Email: to }], Subject: subject, HTML: html, Text: text }),
      });
      return { ok: res.ok };
    }
    return { ok: false };
  } catch {
    return { ok: false };
  }
}
