const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('stationery_store', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb',
    logging: false
});

const Order = sequelize.define('Order', {
    orderID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userID: { type: DataTypes.INTEGER },
    totalAmount: { type: DataTypes.FLOAT },
    status: { type: DataTypes.STRING }
}, { tableName: 'orders', timestamps: true });

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB.');
        const count = await Order.count();
        console.log('Total Orders in DB:', count);
        const orders = await Order.findAll({ limit: 5, order: [['createdAt', 'DESC']] });
        console.log('Recent Orders:', JSON.stringify(orders, null, 2));
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await sequelize.close();
    }
})();
