const nodemailer = require('nodemailer');

// Create reusable transporter with explicit Gmail SMTP settings
const createTransporter = () => {
  const emailUser = (process.env.SUPPORT_EMAIL || '').trim();
  // Remove ALL spaces from app password (Google shows them as "xxxx xxxx xxxx xxxx")
  const emailPass = (process.env.SUPPORT_EMAIL_PASS || '').replace(/\s/g, '');

  console.log(`📧 Mail config: user=${emailUser}, pass=***${emailPass.slice(-4)}`);

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,  // use SSL
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });
};

// @desc    Send support email
// @route   POST /api/contact
exports.sendSupportEmail = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate fields
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address' });
    }
    if (!subject || !subject.trim()) {
      return res.status(400).json({ success: false, message: 'Subject is required' });
    }
    if (!message || !message.trim() || message.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Message must be at least 10 characters' });
    }

    // Check if email credentials are configured
    if (!process.env.SUPPORT_EMAIL || !process.env.SUPPORT_EMAIL_PASS) {
      console.error('❌ SUPPORT_EMAIL or SUPPORT_EMAIL_PASS not set in .env');
      return res.status(500).json({
        success: false,
        message: 'Email service is not configured. Please contact the admin.'
      });
    }

    const transporter = createTransporter();

    // Email to support team (the email you receive)
    const supportMailOptions = {
      from: `"CyberShield Support" <${process.env.SUPPORT_EMAIL}>`,
      to: process.env.SUPPORT_EMAIL,  // sends to itself — supportcybershield@gmail.com
      replyTo: email.trim(),          // so when you reply, it goes to the user
      subject: `[CyberShield Support] ${subject.trim()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #065f46, #064e3b); padding: 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #fff; font-size: 20px; margin: 0;">🛡️ CyberShield Support Request</h1>
          </div>
          <div style="background: #fff; border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 12px 12px;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
              <tr>
                <td style="padding: 8px 12px; font-weight: 600; color: #374151; width: 100px; vertical-align: top;">From:</td>
                <td style="padding: 8px 12px; color: #111827;">${name.trim()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; font-weight: 600; color: #374151; vertical-align: top;">Email:</td>
                <td style="padding: 8px 12px; color: #111827;"><a href="mailto:${email.trim()}" style="color: #059669;">${email.trim()}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; font-weight: 600; color: #374151; vertical-align: top;">Subject:</td>
                <td style="padding: 8px 12px; color: #111827;">${subject.trim()}</td>
              </tr>
            </table>
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-top: 8px;">
              <p style="font-weight: 600; color: #374151; margin: 0 0 8px 0; font-size: 14px;">Message:</p>
              <p style="color: #4b5563; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message.trim()}</p>
            </div>
            <p style="color: #9ca3af; font-size: 12px; margin: 16px 0 0; text-align: center;">
              Sent via CyberShield Support Form • ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `
    };

    // Confirmation email to the user
    const userMailOptions = {
      from: `"CyberShield Support" <${process.env.SUPPORT_EMAIL}>`,
      to: email.trim(),
      subject: `We received your message — CyberShield Support`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #065f46, #064e3b); padding: 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #fff; font-size: 20px; margin: 0;">🛡️ CyberShield</h1>
          </div>
          <div style="background: #fff; border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 12px 12px;">
            <p style="color: #111827; font-size: 16px; margin: 0 0 12px;">Hi ${name.trim()},</p>
            <p style="color: #4b5563; line-height: 1.6; margin: 0 0 16px;">
              Thank you for contacting CyberShield support. We've received your message and our team will get back to you within 24 hours.
            </p>
            <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 14px;">
              <p style="font-weight: 600; color: #065f46; margin: 0 0 4px; font-size: 13px;">Your message:</p>
              <p style="color: #047857; font-size: 13px; margin: 0; font-style: italic;">"${subject.trim()}"</p>
            </div>
            <p style="color: #9ca3af; font-size: 12px; margin: 20px 0 0; text-align: center;">
              CyberShield — Your Online Safety Companion
            </p>
          </div>
        </div>
      `
    };

    // Send both emails
    await transporter.sendMail(supportMailOptions);
    console.log(`✅ Support email received from ${name.trim()} (${email.trim()})`);

    // Send confirmation to user (non-blocking — don't fail if this fails)
    transporter.sendMail(userMailOptions).catch(err => {
      console.error('⚠️ Failed to send confirmation email to user:', err.message);
    });

    res.json({
      success: true,
      message: 'Your message has been sent successfully. We will respond within 24 hours.'
    });

  } catch (error) {
    console.error('❌ Contact email error:', error);

    // Provide helpful error messages
    let userMessage = 'Failed to send message. Please try again later.';
    if (error.code === 'EAUTH') {
      userMessage = 'Email service authentication failed. Please contact the admin.';
      console.error('💡 Tip: Make sure SUPPORT_EMAIL_PASS is a Gmail App Password, not your regular Gmail password.');
      console.error('   1. Enable 2-Step Verification: https://myaccount.google.com/security');
      console.error('   2. Generate App Password: https://myaccount.google.com/apppasswords');
    }

    res.status(500).json({
      success: false,
      message: userMessage
    });
  }
};
