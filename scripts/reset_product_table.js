
import { Sequelize, DataTypes, Model } from 'sequelize';

const sequelize = new Sequelize('stationery_store', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb',
    logging: console.log
});

class Product extends Model { }

Product.init({
    productID: {
        type: DataTypes.INTEGER,
        autoIncrement: true, // Crucial
        primaryKey: true
    },
    name: { type: DataTypes.STRING(100), allowNull: false },
    details: { type: DataTypes.TEXT, allowNull: true },
    price: { type: DataTypes.FLOAT, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    image: { type: DataTypes.STRING(255), allowNull: true },
    type: { type: DataTypes.STRING(50), allowNull: true },
    categoryID: { type: DataTypes.INTEGER, allowNull: true }
}, {
    sequelize,
    tableName: 'product',
    timestamps: true,
    paranoid: true
});

async function resetTable() {
    try {
        await sequelize.authenticate();
        console.log('--- RESETTING PRODUCT TABLE ---');

        // Force sync: drops table if exists
        await Product.sync({ force: true });

        console.log('Product table dropped and recreated successfully.');
        console.log('Auto Increment should be working now.');

    } catch (error) {
        console.error('Error resetting table:', error);
    } finally {
        await sequelize.close();
    }
}

resetTable();
