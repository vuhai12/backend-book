'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      //id, createdAt và updateAt không cần sửa, quan tâm những trường mình cần.
      id: { 
        allowNull: false,
        // autoIncrement: true,
        primaryKey: true,
        // type: Sequelize.INTEGER,
        type: Sequelize.STRING
      },
      
      name: {
        type: Sequelize.STRING,
        defaultValue: 'User'
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
     
      address: {
        type: Sequelize.STRING,
        defaultValue: 'Viet Nam, Ha Noi'
      },
      avatar: {
        type: Sequelize.STRING
        // type: Sequelize.BLOB('long')
      },
      role_code: {
        type: Sequelize.STRING,
        defaultValue: 'R2'
      },
      refresh_token: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: 'TIMESTAMP', 
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: 'TIMESTAMP', 
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};