import { NextResponse } from 'next/server';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === 'string'
      ? body.email.trim().toLowerCase()
      : '';

    if (!emailPattern.test(email) || email.length > 254) {
      return NextResponse.json(
        { message: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Silently accept bot submissions without sending them to Mailchimp.
    if (body.website) return NextResponse.json({ success: true });

    const apiKey = process.env.MAILCHIMP_API_KEY?.trim();
    const server = process.env.MAILCHIMP_SERVER_PREFIX?.trim();
    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID?.trim();

    if (!apiKey || !server || !audienceId) {
      console.error('Missing Mailchimp newsletter configuration');
      return NextResponse.json(
        { message: 'Subscription service unavailable.' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://${server}.api.mailchimp.com/3.0/lists/${audienceId}/members`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email_address: email, status: 'pending' }),
        cache: 'no-store',
      }
    );
    const data = await response.json().catch(() => ({}));

    // Do not disclose audience membership or alter an existing subscription.
    if (!response.ok) {
      if (data.title === 'Member Exists') {
        return NextResponse.json({ success: true });
      }

      console.error('Mailchimp newsletter subscription failed:', {
        status: response.status,
        title: data.title,
      });
      return NextResponse.json(
        { message: 'Unable to subscribe. Please try again later.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter subscription request failed:', error.message);
    return NextResponse.json(
      { message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
