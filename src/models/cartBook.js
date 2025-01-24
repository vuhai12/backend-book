'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CartBook extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            CartBook.belongsToMany(models.Order, { through: 'OrderCartBooks',foreignKey: 'cartBookOrderId',otherkey:'orderCartBookId'});
        }
    }
    CartBook.init({
        cartBookId: DataTypes.STRING,
        bookCartId: DataTypes.STRING,
        isChecked: DataTypes.BOOLEAN,
    }, {
        sequelize,
        modelName: 'CartBook',
    });
    return CartBook;
};