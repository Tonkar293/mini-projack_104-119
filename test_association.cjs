
const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize = new Sequelize('stationery_store', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb',
    logging: console.log
});

class Category extends Model { }
Category.init({
    categoryID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
}, { sequelize, tableName: 'category', timestamps: false });

class Product extends Model { }
Product.init({
    productID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    price: DataTypes.FLOAT,
    categoryID: DataTypes.INTEGER
}, { sequelize, tableName: 'product', timestamps: false });

// Setup Associations (mimicking Product.ts)
Product.belongsTo(Category, { foreignKey: 'categoryID' });
Category.hasMany(Product, { foreignKey: 'categoryID' });

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection OK');

        const products = await Product.findAll({
            include: [{
                model: Category,
                attributes: ['name']
            }]
        });
        console.log('Products found:', JSON.stringify(products, null, 2));

    } catch (error) {
        console.error('Query Error:', error);
    } finally {
        await sequelize.close();
    }
})();
