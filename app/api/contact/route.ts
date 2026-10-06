import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      workEmail,
      company,
      role,
      topic,
      countryCode,
      phone,
      message,
      website, // honeypot
    } = body;

    // 1. Honeypot check for spam bots
    if (website) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // 2. Validate required fields
    if (!firstName?.trim() || !lastName?.trim() || !workEmail?.trim() || !company?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(workEmail.trim())) {
      return NextResponse.json(
        { error: 'Please enter a valid work email address.' },
        { status: 400 }
      );
    }

    // 3. Initialize Resend
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY is not configured in environment variables.');
      return NextResponse.json(
        { error: 'Email service configuration missing. Please contact support.' },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const recipientsRaw = process.env.CONTACT_TO_EMAIL || 'anurag@ladderframe.in';
    const recipientEmails = recipientsRaw.split(',').map((e) => e.trim()).filter(Boolean);
    const senderEmail = process.env.CONTACT_FROM_EMAIL || 'LadderFrame Advisors <notifications@send.ladderframe.in>';
    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const fullPhone = phone?.trim() ? `${countryCode || '+91'} ${phone.trim()}` : 'Not provided';

    // 4. Send Email via Resend
    const { data, error } = await resend.emails.send({
      from: senderEmail,
      to: recipientEmails,
      replyTo: workEmail.trim(),
      subject: `New Advisory Enquiry: ${fullName} (${company.trim()})`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1E2028; background-color: #FAF8F5; margin: 0; padding: 24px; }
              .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border: 1px solid #ECE5DC; border-radius: 6px; overflow: hidden; }
              .header { background-color: #0B1C3A; padding: 24px 32px; color: #FFFFFF; }
              .header h1 { margin: 0; font-size: 20px; font-weight: 600; letter-spacing: -0.01em; }
              .header p { margin: 4px 0 0; font-size: 13px; color: rgba(255, 255, 255, 0.7); }
              .content { padding: 32px; }
              .field-group { margin-bottom: 20px; }
              .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; color: #7C8296; margin-bottom: 4px; }
              .value { font-size: 15px; color: #0B1C3A; font-weight: 500; }
              .message-box { background: #FAF8F5; border: 1px solid #ECE5DC; border-left: 3px solid #FF1E3E; padding: 16px; border-radius: 4px; font-size: 15px; color: #1E2028; white-space: pre-wrap; }
              .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
              .footer { background: #F3EFEA; padding: 16px 32px; font-size: 12px; color: #535768; border-top: 1px solid #ECE5DC; text-align: center; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>New Advisory Note Received</h1>
                <p>Submitted via ladderframe.in contact form</p>
              </div>
              <div class="content">
                <div class="meta-grid">
                  <div class="field-group">
                    <div class="label">Full Name</div>
                    <div class="value">${fullName}</div>
                  </div>
                  <div class="field-group">
                    <div class="label">Company</div>
                    <div class="value">${company.trim()}</div>
                  </div>
                </div>

                <div class="meta-grid">
                  <div class="field-group">
                    <div class="label">Work Email</div>
                    <div class="value"><a href="mailto:${workEmail.trim()}" style="color: #0B1C3A; text-decoration: underline;">${workEmail.trim()}</a></div>
                  </div>
                  <div class="field-group">
                    <div class="label">Phone</div>
                    <div class="value">${fullPhone}</div>
                  </div>
                </div>

                <div class="meta-grid">
                  <div class="field-group">
                    <div class="label">Role</div>
                    <div class="value">${role || 'Not specified'}</div>
                  </div>
                  <div class="field-group">
                    <div class="label">Discussion Topic</div>
                    <div class="value">${topic || 'General Advisory'}</div>
                  </div>
                </div>

                <div class="field-group">
                  <div class="label">Message / Business Situation</div>
                  <div class="message-box">${message.trim()}</div>
                </div>
              </div>
              <div class="footer">
                You can reply directly to this email to contact <strong>${fullName}</strong>.
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend API error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to send enquiry.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error('Contact route error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
