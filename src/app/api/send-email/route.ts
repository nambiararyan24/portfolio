import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ContactFormData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const data: ContactFormData = await request.json();
    
    // Check if Resend API key is available
    if (!process.env.RESEND_API_KEY) {
      console.log('Resend API key not configured, skipping email sending');
      return NextResponse.json({ 
        success: true, 
        message: 'Lead saved but email not sent (API key not configured)' 
      });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Send notification email to admin
    const adminEmail = await resend.emails.send({
      from: 'Portfolio Contact Form <noreply@yourdomain.com>',
      to: [process.env.ADMIN_EMAIL || 'admin@example.com'],
      subject: `New Contact Form Submission - ${data.project_type}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ''}
        <p><strong>Project Type:</strong> ${data.project_type}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
      `,
    });

    // Send auto-response to user
    const userEmail = await resend.emails.send({
      from: 'Your Name <noreply@yourdomain.com>',
      to: [data.email],
      subject: 'Thank you for your message!',
      html: `
        <h2>Thank you for reaching out!</h2>
        <p>Hi ${data.name},</p>
        <p>Thank you for your interest in working with me. I've received your message about your ${data.project_type.toLowerCase()} project and will get back to you within 24 hours.</p>
        <p>In the meantime, feel free to check out my <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/projects">portfolio</a> or connect with me on social media.</p>
        <p>Best regards,<br>Your Name</p>
      `,
    });

    return NextResponse.json({ 
      success: true, 
      adminEmailId: adminEmail.data?.id,
      userEmailId: userEmail.data?.id 
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
