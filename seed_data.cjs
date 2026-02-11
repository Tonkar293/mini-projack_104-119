
const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize = new Sequelize('stationery_store', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb',
    logging: false
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

(async () => {
    try {
        await sequelize.authenticate();

        // Add Category
        const cat = await Category.create({ name: 'Textbooks' });
        console.log('Created Category:', cat.name);

        // Add Product
        const p = await Product.create({
            name: 'Mathematics 101',
            price: 250,
            categoryID: cat.categoryID
        });
        console.log('Created Product:', p.name);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
})();
