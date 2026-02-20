const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql', // 🔥 đổi từ postgres -> mysql
  port: process.env.DB_PORT || 3306, // 🔥 đổi 5432 -> 3306
  logging: false,
  retry: {
    max: 5, // thử connect lại 5 lần
  },
});

const connectionDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

connectionDatabase();

module.exports = sequelize;
