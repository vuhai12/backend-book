'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BookUser extends Model {
    static associate(models) {}
  }
  BookUser.init(
    {
      bookUserId: DataTypes.STRING,
      userBookId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'BookUser',
    }
  );
  return BookUser;
};
