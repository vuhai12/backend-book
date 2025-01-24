'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Cart extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Cart.belongsTo(models.User, { foreignKey: 'cartUserId', as: 'CartUserData' });
            Cart.belongsToMany(models.Book, { through: 'CartBooks',as:'books' ,foreignKey: 'cartBookId', otherKey:'bookCartId' });
        }
    }
    Cart.init({
        cartUserId: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Cart',
    });
    return Cart;
};