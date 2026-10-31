import 'server-only';
import { createAdminClient, isAdminConfigured } from '@/lib/supabase/admin';
import { isEmailConfigured, sendEmail } from '@/lib/email/send';
import { isLocale, type Locale } from '@/i18n/config';
import { siteUrl } from '@/lib/site';

// Address shape: no whitespace, and no comma/angle brackets/quotes (which could split a recipient list
// or break an address header). The DB check constraint mirrors the essential part.
const EMAIL_RE = /^[^\s@,<>"]+@[^\s@,<>"]+\.[^\s@,<>"]+$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// A pending confirmation is valid for seven days; a cooldown stops a confirmation email being re-sent
// (and the same address being used to spam an inbox) on rapid repeat submits.
const CONFIRM_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;

export type SubscribeResult = { status: 'sent' | 'already' | 'invalid' | 'unavailable' | 'error' };

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const MAIL: Record<Locale, { subject: string; lead: string; cta: string; ignore: string }> = {
  en: { subject: 'Confirm your CityQuest newsletter', lead: 'Please confirm you want launch news from CityQuest.', cta: 'Confirm subscription', ignore: 'If you did not request this, ignore this email — nothing happens until you confirm.' },
  de: { subject: 'Bestätige deinen CityQuest-Newsletter', lead: 'Bitte bestätige, dass du Launch-News von CityQuest erhalten möchtest.', cta: 'Anmeldung bestätigen', ignore: 'Falls du das nicht angefordert hast, ignoriere diese E-Mail — ohne Bestätigung passiert nichts.' },
  nl: { subject: 'Bevestig je CityQuest-nieuwsbrief', lead: 'Bevestig dat je lanceringsnieuws van CityQuest wilt ontvangen.', cta: 'Aanmelding bevestigen', ignore: 'Heb je dit niet aangevraagd? Negeer deze e-mail — zonder bevestiging gebeurt er niets.' },
  ar: { subject: 'أكِّد اشتراكك في نشرة CityQuest', lead: 'يرجى تأكيد رغبتك في تلقّي أخبار إطلاق CityQuest.', cta: 'تأكيد الاشتراك', ignore: 'إذا لم تطلب ذلك، تجاهل هذه الرسالة — لا يحدث شيء دون تأكيد.' },
};

// The confirm email carries only the confirm link. There is deliberately no unsubscribe link here:
// a pending address has nothing to unsubscribe from, and an email-scanner prefetch of such a link
// could otherwise silently unsubscribe someone.
function confirmEmail(locale: Locale, confirmUrl: string): { subject: string; html: string; text: string } {
  const m = MAIL[locale];
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const url = esc(confirmUrl);
  const html = `<div dir="${dir}" style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;color:#0B1324">
  <h1 style="font-size:20px">CityQuest</h1>
  <p>${esc(m.lead)}</p>
  <p><a href="${url}" style="display:inline-block;background:#DDB66A;color:#0B1324;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:600">${esc(m.cta)}</a></p>
  <p style="color:#6b7280;font-size:13px">${esc(m.ignore)}</p>
</div>`;
  const text = `${m.lead}\n\n${m.cta}: ${confirmUrl}\n\n${m.ignore}`;
  return { subject: m.subject, html, text };
}

/** Start (or restart) a double opt-in subscription: store a pending row and email a confirm link. */
export async function subscribe(emailRaw: unknown, localeRaw: unknown): Promise<SubscribeResult> {
  if (!isAdminConfigured() || !isEmailConfigured()) return { status: 'unavailable' };
  if (typeof emailRaw !== 'string') return { status: 'invalid' };
  const email = emailRaw.trim().toLowerCase();
  if (email.length > 254 || !EMAIL_RE.test(email)) return { status: 'invalid' };
  const locale: Locale = typeof localeRaw === 'string' && isLocale(localeRaw) ? localeRaw : 'de';
  const admin = createAdminClient();

  const { data: existing } = await admin
    .from('newsletter_subscribers')
    .select('status, token, updated_at')
    .eq('email', email)
    .maybeSingle();
  if (existing?.status === 'confirmed') return { status: 'already' };
  // Cooldown: do not re-send (or let a third party re-trigger a send) within the window.
  if (existing && Date.now() - Date.parse(existing.updated_at) < RESEND_COOLDOWN_MS) return { status: 'sent' };

  const token = globalThis.crypto.randomUUID();
  if (existing) {
    const { error } = await admin
      .from('newsletter_subscribers')
      .update({ status: 'pending', token, locale, consent_at: new Date().toISOString(), confirmed_at: null, unsubscribed_at: null })
      .eq('email', email);
    if (error) return { status: 'error' };
  } else {
    const { error } = await admin.from('newsletter_subscribers').insert({ email, token, locale, source: 'site' });
    if (error) return { status: 'error' };
  }

  const confirmUrl = `${siteUrl}/${locale}/newsletter?confirm=${token}`;
  const { ok } = await sendEmail({ to: email, ...confirmEmail(locale, confirmUrl) });
  return { status: ok ? 'sent' : 'error' };
}

export type TokenResult = 'ok' | 'already' | 'invalid';

/** Confirm only a still-pending, non-expired token. An unsubscribed or stale token cannot re-confirm. */
export async function confirmByToken(token: string): Promise<TokenResult> {
  if (!isAdminConfigured() || !UUID_RE.test(token)) return 'invalid';
  const admin = createAdminClient();
  const { data } = await admin.from('newsletter_subscribers').select('status, consent_at').eq('token', token).maybeSingle();
  if (!data) return 'invalid';
  if (data.status === 'confirmed') return 'already';
  if (data.status !== 'pending') return 'invalid';
  if (Date.now() - Date.parse(data.consent_at) > CONFIRM_TTL_MS) return 'invalid';
  const { error } = await admin
    .from('newsletter_subscribers')
    .update({ status: 'confirmed', confirmed_at: new Date().toISOString(), unsubscribed_at: null })
    .eq('token', token);
  return error ? 'invalid' : 'ok';
}

export async function unsubscribeByToken(token: string): Promise<TokenResult> {
  if (!isAdminConfigured() || !UUID_RE.test(token)) return 'invalid';
  const admin = createAdminClient();
  const { data } = await admin.from('newsletter_subscribers').select('status').eq('token', token).maybeSingle();
  if (!data) return 'invalid';
  if (data.status === 'unsubscribed') return 'already';
  const { error } = await admin
    .from('newsletter_subscribers')
    .update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() })
    .eq('token', token);
  return error ? 'invalid' : 'ok';
}
