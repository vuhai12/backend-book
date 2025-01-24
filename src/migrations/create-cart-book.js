'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CartBooks', {
      //id, createdAt và updateAt không cần sửa, quan tâm những trường mình cần.
      id: { 
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
       
      },
      isChecked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }, 
      cartBookId: {
        type: Sequelize.STRING
      },
      bookCartId: {
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
    await queryInterface.dropTable('CartBooks');
  }
};