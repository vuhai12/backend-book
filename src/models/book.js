'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    static associate(models) {
      Book.belongsTo(models.Category, { foreignKey: 'category_code', targetKey: 'code', as: 'categoryData' });
      Book.belongsToMany(models.Cart, { through: 'CartBooks', as: 'carts', foreignKey: 'bookCartId', otherkey: 'cartBookId' });
      Book.belongsToMany(models.User, { through: 'BookUser', foreignKey: 'bookUserId' });
      Book.belongsToMany(models.Order, { through: 'OrderBooks', as: 'orders', foreignKey: 'bookOrderId', otherkey: 'orderBookId' });
      Book.hasMany(models.Comment, { foreignKey: 'bookId' });
    }
  }
  Book.init(
    {
      title: DataTypes.STRING,
      price: DataTypes.FLOAT,
      quantity: DataTypes.INTEGER,
      available: DataTypes.INTEGER,
      image: DataTypes.STRING,
      description: DataTypes.TEXT,
      category_code: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Book',
    }
  );
  return Book;
};
