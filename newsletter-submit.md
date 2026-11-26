# Newsletter subscription / Suscripción al newsletter

Le Coup de Foudre — Next.js App Router + Mailchimp Marketing API 3.0

## English

### Overview

The footer subscribes visitors to a Mailchimp audience through a server-side POST endpoint, without redirects, additional dependencies or a database. Only the form is a Client Component; the footer remains a Server Component. Existing newsletter archive functionality is unchanged.

### Configuration

Find the Audience ID in Mailchimp under Audience → Settings. Reuse the existing API key and datacenter. Add the variables shown below to `.env.local` and to the appropriate Vercel environments. Redeploy after changing Vercel variables. Never use `NEXT_PUBLIC_` for credentials or commit real secrets.

### Subscription flow

The form validates the email, submits JSON to `/api/newsletter`, disables controls while loading and displays feedback. The endpoint validates input, checks a honeypot and sends a POST request to Mailchimp. `pending` enables double opt-in; the contact must confirm by email. Existing contacts receive a generic success response without revealing membership or automatically resubscribing unsubscribed contacts.

### Testing and production

Run `npm run dev`, submit an email you control, check the audience for the pending contact, confirm the email and verify the subscribed status. Test invalid addresses, existing contacts and service failures. The example uses a provisional `/privacy` link; replace it with the real policy URL. Double opt-in supports consent documentation but does not by itself establish GDPR compliance. Add rate limiting or server-verified Turnstile before production: the honeypot is only basic protection. If the audience requires additional merge fields, configure them or supply them in the request. The integration has not been tested against the client's live audience here.

## Español

### Descripción

El formulario del footer registra visitantes en una audiencia de Mailchimp mediante un endpoint POST del servidor, sin redirecciones, dependencias adicionales ni base de datos. Solo el formulario es un Client Component; el footer permanece como Server Component. La grilla de newsletters existente no se modifica.

### Configuración

Obtener el Audience ID en Mailchimp desde Audience → Settings. Reutilizar la API Key y el datacenter existentes. Agregar las variables indicadas abajo en `.env.local` y en los entornos correspondientes de Vercel. Realizar un nuevo deploy después de modificar las variables de Vercel. No utilizar `NEXT_PUBLIC_` ni subir credenciales reales al repositorio.

### Flujo de suscripción

El formulario valida el email, envía JSON a `/api/newsletter`, deshabilita los controles durante la carga y muestra mensajes de respuesta. El endpoint valida los datos, comprueba un honeypot y realiza un POST a Mailchimp. El estado `pending` habilita el doble opt-in: el contacto debe confirmar por correo. Los contactos existentes reciben una respuesta genérica de éxito sin revelar su pertenencia a la audiencia ni reactivar automáticamente contactos dados de baja.

### Pruebas y producción

Ejecutar `npm run dev`, enviar un email propio, verificar el contacto pendiente en la audiencia, confirmar el correo y comprobar el estado de suscripción. Probar emails inválidos, contactos existentes y errores del servicio. Reemplazar `/privacy` por la ruta real de privacidad. El doble opt-in ayuda a acreditar el consentimiento, pero no garantiza por sí solo el cumplimiento del RGPD. Incorporar rate limiting o Turnstile con validación del servidor antes de producción: el honeypot es una protección básica. Si la audiencia exige campos adicionales, configurarlos o enviarlos en la solicitud. No se ha probado aquí contra la audiencia real del cliente.

## Shared implementation / Implementación compartida

### File structure / Estructura

```text
app/
├── api/newsletter/route.js
├── components/NewsletterForm.jsx
├── components/.../FooterSecondary.jsx
├── lib/mailchimp.js (unchanged / sin cambios)
└── newsletters/page.jsx (unchanged / sin cambios)
.env.local
```

### Environment variables / Variables de entorno

```env
MAILCHIMP_API_KEY=YOUR_API_KEY
MAILCHIMP_SERVER_PREFIX=us1
MAILCHIMP_AUDIENCE_ID=YOUR_AUDIENCE_ID
```

### `app/api/newsletter/route.js`

```js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === 'string'
      ? body.email.trim().toLowerCase() : '';

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return NextResponse.json(
        { message: 'Please enter a valid email address.' }, { status: 400 }
      );
    }

    if (body.website) return NextResponse.json({ success: true });

    const apiKey = process.env.MAILCHIMP_API_KEY?.trim();
    const server = process.env.MAILCHIMP_SERVER_PREFIX?.trim();
    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID?.trim();

    if (!apiKey || !server || !audienceId) {
      console.error('Missing Mailchimp credentials');
      return NextResponse.json(
        { message: 'Subscription service unavailable.' }, { status: 500 }
      );
    }

    const response = await fetch(
      `https://${server}.api.mailchimp.com/3.0/lists/${audienceId}/members`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email_address: email, status: 'pending' }),
        cache: 'no-store',
      }
    );
    const data = await response.json();

    if (!response.ok) {
      if (data.title === 'Member Exists') {
        return NextResponse.json({ success: true });
      }
      console.error('Mailchimp subscription error:', {
        status: response.status, title: data.title,
      });
      return NextResponse.json(
        { message: 'Unable to subscribe. Please try again later.' }, { status: 502 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter subscription error:', error.message);
    return NextResponse.json(
      { message: 'Something went wrong. Please try again.' }, { status: 500 }
    );
  }
}
```

### `app/components/NewsletterForm.jsx`

```jsx
'use client';
import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setStatus(null);
    setMessage('');
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to subscribe.');
      setStatus('success');
      setMessage('Thank you. If confirmation is required, please check your inbox.');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="footer-newsletter-email">Your email address</label>
      <div className="home3-footer__form-row">
        <input id="footer-newsletter-email" name="email" type="email"
          placeholder="Email address" autoComplete="email" value={email}
          onChange={event => setEmail(event.target.value)} disabled={loading} required />
        <button type="submit" disabled={loading} aria-label="Subscribe to the newsletter">
          {loading ? 'Subscribing...' : 'Subscribe'}
          {!loading && <span aria-hidden="true"> →</span>}
        </button>
      </div>
      <div hidden aria-hidden="true">
        <input type="text" name="website" value={website}
          onChange={event => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off" />
      </div>
      <p className="home3-footer__newsletter-consent">
        By subscribing, you agree to receive our newsletters. You may unsubscribe at any time.
        {' '}<a href="/privacy">Privacy Policy</a>.
      </p>
      {message && <p className={`home3-footer__form-message is-${status}`}
        role={status === 'error' ? 'alert' : 'status'}>{message}</p>}
    </form>
  );
}
```

### Footer integration / Integración en el footer

Adjust the import path to the actual component location. / Ajustar la ruta de importación a la ubicación real del componente.

```jsx
import NewsletterForm from '../NewsletterForm';
```

Replace the old newsletter block (including the mailto form). / Reemplazar el bloque anterior del newsletter (incluido el formulario mailto).

```jsx
<div className="home3-footer__newsletter">
  <span>Newsletter</span>
  <p>Privileged dispatches from our Parisian salon.</p>
  <NewsletterForm />
</div>
```

### CSS additions / Estilos adicionales

```css
.home3-footer__form-message {
  font-size: 12px;
  line-height: 1.5;
  margin-top: 12px;
  animation: newsletterFadeIn 0.3s ease;
}
.home3-footer__form-message.is-success { color: #a8c7a0; }
.home3-footer__form-message.is-error { color: #e5a09a; }
.home3-footer__form-row button:disabled { opacity: 0.5; cursor: wait; }
.home3-footer__form-row input:disabled { opacity: 0.6; }
.home3-footer__newsletter-consent {
  font-size: 10px;
  line-height: 1.5;
  opacity: 0.6;
  margin-top: 12px;
}
.home3-footer__newsletter-consent a { color: inherit; text-decoration: underline; }
@keyframes newsletterFadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Endpoint test / Prueba del endpoint

```bash
curl -X POST http://localhost:3000/api/newsletter \
  -H 'Content-Type: application/json' \
  -d '{"email":"YOUR_TEST_EMAIL"}'
```

Expected response / Respuesta esperada:

```json
{"success":true}
```

| HTTP | English | Español |
|---|---|---|
| 200 | Accepted or existing contact | Solicitud aceptada o contacto existente |
| 400 | Invalid email | Email inválido |
| 500 | Server or configuration error | Error de servidor o configuración |
| 502 | Mailchimp rejected the request | Mailchimp rechazó la solicitud |

## References / Referencias

- [Mailchimp Marketing API](https://mailchimp.com/developer/marketing/api/)
- [Add member to audience](https://mailchimp.com/developer/marketing/api/list-members/add-member-to-list/)
- [Next.js Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers)
- [Vercel environment variables](https://vercel.com/docs/environment-variables)
