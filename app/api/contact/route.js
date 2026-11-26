import { NextResponse } from 'next/server';
import { sendContactEmail } from '../../lib/contact-email';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const body = await request.json();

    if (body?.website) return NextResponse.json({ success: true });

    const result = await sendContactEmail(body || {});
    if (result.error) {
      const status = result.error.startsWith('Please') ? 400 : 500;
      return NextResponse.json({ message: result.error }, { status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form delivery failed:', error.message);
    return NextResponse.json(
      { message: 'We could not send your message. Please try again shortly.' },
      { status: 502 }
    );
  }
}
