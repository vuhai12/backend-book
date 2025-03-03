import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Email gửi
    pass: process.env.EMAIL_PASS, // Mật khẩu ứng dụng Gmail
  },
});

export const sendResetPasswordEmail = async (email, token) => {
  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Đặt lại mật khẩu',
    html: `<p>Bạn đã yêu cầu đặt lại mật khẩu. Nhấp vào liên kết bên dưới để đặt lại:</p>
           <a href="${resetLink}">Đặt lại mật khẩu</a>
           <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>`,
  };

  console.log('resetLink', resetLink);
  console.log('mailOptions', mailOptions);

  return transporter.sendMail(mailOptions);
};
