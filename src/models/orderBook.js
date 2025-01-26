'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderBook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  OrderBook.init(
    {
      id: {
        type: DataTypes.STRING, // Hoặc DataTypes.UUID
        primaryKey: true, // Định nghĩa đây là khóa chính
        allowNull: false,
      },
      orderBookId: DataTypes.STRING,
      bookOrderId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'OrderBook',
    }
  );
  return OrderBook;
};
