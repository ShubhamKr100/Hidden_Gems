const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,     // Aapki Gmail ID
      pass: process.env.SMTP_PASSWORD,  // 16-digit Google App Password
    },
  });

  const message = {
    from: `${process.env.FROM_NAME || 'Hidden Gems'} <${process.env.SMTP_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  await transporter.sendMail(message);
};

module.exports = sendEmail;