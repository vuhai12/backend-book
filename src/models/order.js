'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Order.belongsTo(models.User, { foreignKey: 'orderUserId', as: 'orderUserData' });
            Order.belongsToMany(models.Book, { through: 'OrderBooks', as: 'books',foreignKey: 'orderBookId',otherkey:'bookOrderId'});
            Order.belongsToMany(models.CartBook, { through: 'OrderCartBooks',foreignKey: 'orderCartBookId',otherkey:'cartBookOrderId'});
        }
    }
    Order.init({
        totalPrices: DataTypes.INTEGER,
        paymentMethod: DataTypes.STRING,
        orderUserId: DataTypes.STRING,
        status: DataTypes.STRING,
        isDelivered: DataTypes.BOOLEAN,
        isPaid: DataTypes.BOOLEAN,
    }, {
        sequelize,
        modelName: 'Order',
    });
    return Order;
};