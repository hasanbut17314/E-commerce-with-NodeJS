import nodemailer from 'nodemailer';

const sendVerificationEmail = async (user, subject, html) => {

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendVerificationEmail;
