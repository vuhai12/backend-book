'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      Cart.belongsTo(models.User, { foreignKey: 'cartUserId', as: 'CartUserData' });
      Cart.belongsToMany(models.Book, { through: 'CartBooks', as: 'books', foreignKey: 'cartBookId', otherKey: 'bookCartId' });
    }
  }
  Cart.init(
    {
      cartUserId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Cart',
    }
  );
  return Cart;
};
