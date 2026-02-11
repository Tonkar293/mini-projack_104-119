
import { Sequelize, DataTypes, Model } from 'sequelize';

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
    details: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    image: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    type: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    categoryID: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    sequelize,
    tableName: 'product',
    timestamps: true,
    paranoid: true
});

async function deleteProducts() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Delete "Test Product Persistence" (price 100)
        const result1 = await Product.destroy({
            where: {
                name: 'Test Product Persistence',
                price: 100
            }
        });
        console.log(`Deleted "Test Product Persistence": ${result1} rows`);

        // Delete "Mathematics 101" (price 250)
        const result2 = await Product.destroy({
            where: {
                name: 'Mathematics 101',
                price: 250
            }
        });
        console.log(`Deleted "Mathematics 101": ${result2} rows`);

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
}

deleteProducts();
