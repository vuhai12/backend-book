// import { transporter } from './src/config/email.js';
import pkg from './src/config/email.js';
const { transporter } = pkg;

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: 'vuhai8899k@gmail.com', // Email người nhận
  subject: 'Test Email',
  text: 'Đây là email test gửi từ Nodemailer!',
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('❌ Lỗi khi gửi email:', error);
  } else {
    console.log('✅ Email đã gửi thành công:', info.response);
  }
});
