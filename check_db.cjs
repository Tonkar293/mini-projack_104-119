
const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize = new Sequelize('stationery_store', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb',
    logging: false
});

const Product = sequelize.define('product', {
    productID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    price: DataTypes.FLOAT,
    categoryID: DataTypes.INTEGER
}, { tableName: 'product', timestamps: false });

(async () => {
    try {
        await sequelize.authenticate();
        const count = await Product.count();
        console.log('Product count:', count);

        const products = await Product.findAll({ limit: 5 });
        console.log('Sample products:', JSON.stringify(products, null, 2));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
})();
