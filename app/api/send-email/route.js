// app/api/send-email/route.ts
import { NextResponse } from 'next/server';
import { sendMail } from '@/lib/sendMail';

export async function POST(req) {
  try {
    const body = await req.json();

    const { to, subject, userName, activationLink } = body;

    // Validate required fields
    if (!to || !subject || !userName || !activationLink) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, userName, activationLink' },
        { status: 400 }
      );
    }

    // Send the email
    const result = await sendMail(to, subject, { userName, activationLink });

    return NextResponse.json(
      { message: 'Email sent successfully', result },
      { status: 200 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to send email', details: error.message },
      { status: 500 }
    );
  }
}

// Optional: Disable other methods
export function GET() {
  return NextResponse.json(
    { error: 'Method Not Allowed' },
    { status: 405 }
  );
}
