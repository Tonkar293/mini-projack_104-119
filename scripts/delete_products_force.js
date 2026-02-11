
import { Sequelize, DataTypes, Model, Op } from 'sequelize';

// Database connection
const sequelize = new Sequelize('stationery_store', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb',
    logging: console.log
});

class Product extends Model { }

Product.init({
    productID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'product',
    timestamps: true,
    paranoid: true
});

async function forceDeleteProducts() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Find and delete "Test Product Persistence" (paranoid: false to check deleted ones too)
        const items1 = await Product.findAll({
            where: {
                name: { [Op.like]: '%Test Product Persistence%' }
            },
            paranoid: false
        });

        for (const item of items1) {
            console.log(`Destroying ${item.name} (${item.productID})`);
            await item.destroy({ force: true });
        }

        // Find and delete "Mathematics 101"
        const items2 = await Product.findAll({
            where: {
                name: { [Op.like]: '%Mathematics 101%' }
            },
            paranoid: false
        });

        for (const item of items2) {
            console.log(`Destroying ${item.name} (${item.productID})`);
            await item.destroy({ force: true });
        }

    } catch (error) {
        console.error('Unable to delete:', error);
    } finally {
        await sequelize.close();
    }
}

forceDeleteProducts();
