import 'server-only';

import path from 'node:path';
import nodemailer from 'nodemailer';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanValue(value, maxLength = 1000) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[character]);
}

function field(label, value) {
  return `<tr>
    <td style="padding: 13px 16px; border-bottom: 1px solid #dedbd3; color: #7c715e; font: 600 11px Arial, sans-serif; letter-spacing: 1.2px; text-transform: uppercase; vertical-align: top;">${label}</td>
    <td style="padding: 13px 16px; border-bottom: 1px solid #dedbd3; color: #162238; font: 16px Georgia, serif; line-height: 1.5;">${escapeHtml(value || '—').replace(/\n/g, '<br>')}</td>
  </tr>`;
}

function createHtmlEmail({ name, email, country, journey, guests, message }) {
  return `<!doctype html>
  <html lang="en"><body style="margin:0; padding:32px 16px; background:#f4f1ea;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px; background:#f9f8f5; border:1px solid #d7cfbf;">
        <tr><td style="padding:36px 40px 30px; background:#162238; text-align:center;">
          <img src="cid:le-coup-de-foudre-logo" width="58" height="58" alt="Le Coup de Foudre Paris" style="display:block; width:58px; height:58px; margin:0 auto 18px; background:#f9f8f5;" />
          <div style="color:#f9f8f5; font:400 30px Georgia, serif; letter-spacing:-.5px;">Le Coup de Foudre</div>
          <div style="margin-top:7px; color:#d2bd92; font:600 10px Arial, sans-serif; letter-spacing:2.5px; text-transform:uppercase;">Paris · New enquiry</div>
        </td></tr>
        <tr><td style="padding:34px 40px 40px;">
          <h1 style="margin:0 0 8px; color:#162238; font:400 30px Georgia, serif;">A new conversation begins</h1>
          <p style="margin:0 0 28px; color:#4e545c; font:16px Georgia, serif; line-height:1.5;">${escapeHtml(name)} has written through the Le Coup de Foudre contact form.</p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #dedbd3; border-collapse:collapse;">
            ${field('Name', name)}
            ${field('Email', email)}
            ${field('Country', country)}
            ${field('Journey style', journey)}
            ${field('Guests', guests)}
            ${field('Their idea', message)}
          </table>
          <p style="margin:28px 0 0; color:#7c715e; font:12px Arial, sans-serif; line-height:1.5;">Reply directly to this email to continue the conversation with ${escapeHtml(name)}.</p>
        </td></tr>
      </table>
    </td></tr></table>
  </body></html>`;
}

export async function sendContactEmail(payload) {
  const name = cleanValue(payload.name, 120);
  const email = cleanValue(payload.email, 254).toLowerCase();
  const country = cleanValue(payload.country, 120);
  const journey = cleanValue(payload.journey, 120);
  const guests = cleanValue(payload.guests, 24);
  const message = cleanValue(payload.message, 4000);

  if (!name || !emailPattern.test(email) || !message) {
    return { error: 'Please complete your name, a valid email address and your message.' };
  }

  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM?.trim() || user;
  const to = process.env.CONTACT_EMAIL?.trim() || 'contact@lecoupdefoudre-paris.com';

  if (!host || !Number.isInteger(port) || !user || !pass) {
    console.error('Missing SMTP contact form configuration');
    return { error: 'The contact service is temporarily unavailable.' };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to,
    replyTo: { name, address: email },
    subject: `New enquiry from ${name}`,
    text: [
      'NEW ENQUIRY — LE COUP DE FOUDRE', '',
      `Name: ${name}`, `Email: ${email}`, `Country: ${country || '—'}`,
      `Journey style: ${journey || '—'}`, `Guests: ${guests || '—'}`,
      '', 'Their idea:', message,
    ].join('\n'),
    html: createHtmlEmail({ name, email, country, journey, guests, message }),
    attachments: [{
      filename: 'le-coup-de-foudre-logo.png',
      path: path.join(process.cwd(), 'public/images/logo-black.png'),
      cid: 'le-coup-de-foudre-logo',
    }],
  });

  return { success: true };
}
