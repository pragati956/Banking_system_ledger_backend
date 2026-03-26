require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend Ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
async function sendRegistrationEmail(userEmail, name) {
  const subject = 'Welcome to Backend Ledger';

  const registrationText = `
Hello ${name},

Welcome to Backend Ledger! Your account has been successfully created.

You can now log in and start managing your banking ledger.

Best regards,
The Backend Ledger Team
`;

  const registrationHtml = `
<p>Hello <strong>${name}</strong>,</p>

<p>Welcome to Backend Ledger! Your account has been successfully created.</p>

<p>You can now log in and start managing your banking ledger.</p>

<p>Best regards,<br>The Backend Ledger Team</p>
`;

  const text = registrationText;
  const html = registrationHtml;

  await sendEmail(userEmail, subject, text, html);
}
async function sendTransactionEmail(userEmail, name, amount, toAccount) {
  const subject = 'Transaction Successful';
  const text = `Hello ${name},

Your transaction of $${amount} to account ${toAccount} has been successfully processed.

`;
  const html = `<p>Hello <strong>${name}</strong>,</p>

<p>Your transaction of <strong>$${amount}</strong> to account <strong>${toAccount}</strong> has been successfully processed.</p>

`;
  await sendEmail(userEmail, subject, text, html);
}
async function sendTransactionFailureEmail(userEmail, name, amount, toAccount, reason) {
  const subject = 'Transaction Failed';
  const text = `Hello ${name},

Your transaction of $${amount} to account ${toAccount} has failed.

Reason: ${reason}

Best regards,
The Backend Ledger Team
`;

  const html = `
<p>Hello <strong>${name}</strong>,</p>

<p>Your transaction of <strong>$${amount}</strong> to account <strong>${toAccount}</strong> has failed.</p>

<p><strong>Reason:</strong> ${reason}</p>

<p>Best regards,<br>The Backend Ledger Team</p>
`;

  await sendEmail(userEmail, subject, text, html);
}

module.exports = { sendEmail, sendRegistrationEmail, sendTransactionEmail, sendTransactionFailureEmail };