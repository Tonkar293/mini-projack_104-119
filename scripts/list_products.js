
import { Sequelize, DataTypes, Model } from 'sequelize';

const sequelize = new Sequelize('stationery_store', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb',
    logging: false
});

class Product extends Model { }

Product.init({
    productID: { type: DataTypes.INTEGER, primaryKey: true },
    name: { type: DataTypes.STRING },
    price: { type: DataTypes.FLOAT }
}, {
    sequelize,
    tableName: 'product',
    timestamps: true,
    paranoid: true
});

async function listProducts() {
    try {
        await sequelize.authenticate();
        const products = await Product.findAll({ paranoid: false });
        console.log('--- PRODUCTS ---');
        products.forEach(p => console.log(`ID: ${p.productID} | Name: "${p.name}" | Price: ${p.price}`));
        console.log('----------------');
    } catch (error) {
        console.error(error);
    } finally {
        await sequelize.close();
    }
}

listProducts();
