'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProfileUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProfileUser.belongsTo(models.User, { foreignKey: 'profileUserId', as: 'ProfileUserIdData' });
    }
  }
  ProfileUser.init({
    address: DataTypes.STRING,
    profileUserId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'ProfileUser',
  });
  return ProfileUser;
};