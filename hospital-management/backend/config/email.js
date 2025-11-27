const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Test email configuration
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Email configuration error:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

// Enhanced sendEmail function with HTML support
const sendEmail = async (to, subject, text, html = null) => {
  try {
    const mailOptions = {
      from: `"Ayushman Hospital" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: html || text // Use HTML if provided, otherwise use text
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully to:', to);
    return result;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

module.exports = sendEmail;