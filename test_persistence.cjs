
const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize = new Sequelize('stationery_store', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb',
    logging: false
});

class Product extends Model { }
Product.init({
    productID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    price: DataTypes.FLOAT,
    categoryID: DataTypes.INTEGER
}, { sequelize, tableName: 'product', timestamps: false });

(async () => {
    try {
        await sequelize.authenticate();
        // Add a product
        const p = await Product.create({
            name: 'Test Product Persistence',
            price: 100,
            categoryID: null // Ensure this works without category first
        });
        console.log('Added product ID:', p.productID);

        // Count
        const count = await Product.count();
        console.log('Count after add:', count);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
})();
