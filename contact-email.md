# Contact email configuration

The contact form sends messages through SMTP with Nodemailer. Add these server-only variables to `.env.local` locally and to the production environment before deploying:

```env
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
# Optional: defaults to SMTP_USER
SMTP_FROM="Le Coup de Foudre <hello@your-domain.com>"
# Optional: defaults to contact@lecoupdefoudre-paris.com
CONTACT_EMAIL=contact@lecoupdefoudre-paris.com
```

Use port `465` for an SMTP provider that requires implicit TLS; port `587` uses STARTTLS. Credentials must never use a `NEXT_PUBLIC_` prefix or be committed.

Each message has the company seal embedded through a CID attachment, a plain-text fallback, and a `Reply-To` header set to the visitor's email address.
