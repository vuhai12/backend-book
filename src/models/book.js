'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // định nghĩa liên kết từ bảng Book đến bảng Category
      //khi đứng ở Book có thể thông qua khóa ngoại là category_code để lấy thông tin tương ứng từ bảng Category

      Book.belongsTo(models.Category, { foreignKey: 'category_code', targetKey: 'code', as: 'categoryData' })
      Book.belongsToMany(models.Cart, { through: 'CartBooks',as:'carts', foreignKey: 'bookCartId',otherkey:'cartBookId' });
      Book.belongsToMany(models.User, { through: 'BookUser', foreignKey: 'bookUserId' });
      Book.belongsToMany(models.Order, { through: 'OrderBooks', as: 'orders', foreignKey: 'bookOrderId', otherkey: 'orderBookId' });
    }
  }
  Book.init({
    title: DataTypes.STRING,
    price: DataTypes.FLOAT,
    quantity: DataTypes.INTEGER,
    available: DataTypes.INTEGER,
    image: DataTypes.STRING,
    description: DataTypes.TEXT,
    category_code: DataTypes.STRING,
    // isChecked: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};