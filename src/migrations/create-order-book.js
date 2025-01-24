'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderBooks', {
      //id, createdAt và updateAt không cần sửa, quan tâm những trường mình cần.
      id: { 
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      orderBookId: {
        type: Sequelize.STRING
      },
      bookOrderId: {
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
    await queryInterface.dropTable('OrderBooks');
  }
};