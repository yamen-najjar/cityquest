import 'server-only';
import { createAdminClient, isAdminConfigured } from '@/lib/supabase/admin';
import { isEmailConfigured, sendEmail } from '@/lib/email/send';
import { isLocale, type Locale } from '@/i18n/config';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type SubscribeResult = { status: 'sent' | 'already' | 'invalid' | 'unavailable' | 'error' };

// Transactional copy for the double opt-in email, per locale. Kept here (not in the UI dictionary)
// because it is only ever rendered server-side into an email.
const MAIL: Record<Locale, { subject: string; lead: string; cta: string; ignore: string; unsub: string }> = {
  en: { subject: 'Confirm your CityQuest newsletter', lead: 'Please confirm you want launch news from CityQuest.', cta: 'Confirm subscription', ignore: 'If you did not request this, ignore this email.', unsub: 'Unsubscribe' },
  de: { subject: 'Bestätige deinen CityQuest-Newsletter', lead: 'Bitte bestätige, dass du Launch-News von CityQuest erhalten möchtest.', cta: 'Anmeldung bestätigen', ignore: 'Falls du das nicht angefordert hast, ignoriere diese E-Mail.', unsub: 'Abmelden' },
  nl: { subject: 'Bevestig je CityQuest-nieuwsbrief', lead: 'Bevestig dat je lanceringsnieuws van CityQuest wilt ontvangen.', cta: 'Aanmelding bevestigen', ignore: 'Heb je dit niet aangevraagd? Negeer deze e-mail.', unsub: 'Afmelden' },
  ar: { subject: 'أكِّد اشتراكك في نشرة CityQuest', lead: 'يرجى تأكيد رغبتك في تلقّي أخبار إطلاق CityQuest.', cta: 'تأكيد الاشتراك', ignore: 'إذا لم تطلب ذلك، تجاهل هذه الرسالة.', unsub: 'إلغاء الاشتراك' },
};

function confirmEmail(locale: Locale, confirmUrl: string, unsubUrl: string): { subject: string; html: string; text: string } {
  const m = MAIL[locale];
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const html = `<div dir="${dir}" style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;color:#0B1324">
  <h1 style="font-size:20px">CityQuest</h1>
  <p>${m.lead}</p>
  <p><a href="${confirmUrl}" style="display:inline-block;background:#DDB66A;color:#0B1324;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:600">${m.cta}</a></p>
  <p style="color:#6b7280;font-size:13px">${m.ignore}</p>
  <p style="color:#6b7280;font-size:13px"><a href="${unsubUrl}" style="color:#6b7280">${m.unsub}</a></p>
</div>`;
  const text = `${m.lead}\n\n${m.cta}: ${confirmUrl}\n\n${m.ignore}\n${m.unsub}: ${unsubUrl}`;
  return { subject: m.subject, html, text };
}

/** Start (or restart) a double opt-in subscription: store a pending row and email a confirm link. */
export async function subscribe(emailRaw: string, localeRaw: string, origin: string): Promise<SubscribeResult> {
  if (!isAdminConfigured() || !isEmailConfigured()) return { status: 'unavailable' };
  const email = emailRaw.trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) return { status: 'invalid' };
  const locale: Locale = isLocale(localeRaw) ? localeRaw : 'de';
  const admin = createAdminClient();

  const { data: existing } = await admin.from('newsletter_subscribers').select('status, token').eq('email', email).maybeSingle();
  if (existing?.status === 'confirmed') return { status: 'already' };

  let token = existing?.token ?? null;
  if (existing) {
    const { data, error } = await admin
      .from('newsletter_subscribers')
      .update({ status: 'pending', locale, consent_at: new Date().toISOString(), confirmed_at: null, unsubscribed_at: null })
      .eq('email', email)
      .select('token')
      .single();
    if (error) return { status: 'error' };
    token = data.token;
  } else {
    const { data, error } = await admin
      .from('newsletter_subscribers')
      .insert({ email, locale, source: 'site' })
      .select('token')
      .single();
    if (error) return { status: 'error' };
    token = data.token;
  }
  if (!token) return { status: 'error' };

  const confirmUrl = `${origin}/${locale}/newsletter?confirm=${token}`;
  const unsubUrl = `${origin}/${locale}/newsletter?unsubscribe=${token}`;
  const { ok } = await sendEmail({ to: email, ...confirmEmail(locale, confirmUrl, unsubUrl) });
  return { status: ok ? 'sent' : 'error' };
}

export type TokenResult = 'ok' | 'already' | 'invalid';

export async function confirmByToken(token: string): Promise<TokenResult> {
  if (!isAdminConfigured() || !UUID_RE.test(token)) return 'invalid';
  const admin = createAdminClient();
  const { data } = await admin.from('newsletter_subscribers').select('status').eq('token', token).maybeSingle();
  if (!data) return 'invalid';
  if (data.status === 'confirmed') return 'already';
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
