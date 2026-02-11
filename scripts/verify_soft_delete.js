
import { Sequelize, DataTypes, Model } from 'sequelize';

const sequelize = new Sequelize('stationery_store', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb',
    logging: false
});

class Product extends Model { }

Product.init({
    productID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    price: { type: DataTypes.FLOAT },
    quantity: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
    sequelize,
    tableName: 'product',
    timestamps: true,
    paranoid: true
});

async function verifySoftDelete() {
    try {
        await sequelize.authenticate();
        console.log('--- TEST: SOFT DELETE ---');

        // Create
        const p = await Product.create({ name: 'Test Delete Me', price: 99, quantity: 1 });
        console.log(`Created: ${p.productID} | ${p.name}`);

        // Fetch
        const fetched = await Product.findByPk(p.productID);
        if (fetched) console.log(`Fetched (Alive): Yes`);
        else console.log(`Fetched (Alive): NO (Error)`);

        // Delete
        await fetched.destroy();
        console.log(`Deleted (destroy called)`);

        // Fetch again (should be null)
        const fetched2 = await Product.findByPk(p.productID);
        if (fetched2) console.log(`Fetched (After Delete): STILL HERE (FAIL)`);
        else console.log(`Fetched (After Delete): GONE (SUCCESS)`);

        // Fetch paranoid: false (should exist)
        const fetched3 = await Product.findByPk(p.productID, { paranoid: false });
        if (fetched3) console.log(`Fetched (Paranoid: False): FOUND (SUCCESS) | deletedAt: ${fetched3.deletedAt}`);
        else console.log(`Fetched (Paranoid: False): NOT FOUND (FAIL)`);

        // Clean up hard delete
        await fetched3.destroy({ force: true });
        console.log(`Cleanup: Hard deleted`);

        console.log('----------------');
    } catch (error) {
        console.error(error);
    } finally {
        await sequelize.close();
    }
}

verifySoftDelete();
