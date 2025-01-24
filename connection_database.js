const { Sequelize } = require('sequelize');
import db from './src/models/index';
require('dotenv').config();

// Kết nối với PostgreSQL
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres', // Đổi từ 'mysql' thành 'postgres'
  port: process.env.DB_PORT || 5432, // Cổng mặc định của PostgreSQL là 5432
  logging: false, // Ẩn log
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

/* 
    process.env.DB_NAME: tên database của bạn
    process.env.DB_USERNAME: tên người dùng PostgreSQL
    process.env.DB_PASSWORD: mật khẩu người dùng PostgreSQL
    process.env.DB_HOST: địa chỉ máy chủ PostgreSQL (ví dụ: 'localhost' hoặc IP từ xa)
    process.env.DB_PORT: cổng kết nối (5432 mặc định cho PostgreSQL)
*/

// Kiểm tra kết nối và truy vấn dữ liệu
const connectionDatabase = async () => {
  try {
    await sequelize.authenticate(); // Kiểm tra kết nối
    const res = await db.User.findAll(); // Truy vấn dữ liệu từ bảng User
    console.log('res', res);
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

connectionDatabase();
