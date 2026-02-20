'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {}
  }
  Category.init(
    {
      code: DataTypes.STRING,
      value: {
        type: DataTypes.STRING,
        set(value) {
          this.setDataValue('value', value.charAt(0).toUpperCase() + value.slice(1));
        },
      },
    },
    {
      sequelize,
      modelName: 'Category',
    }
  );
  return Category;
};
