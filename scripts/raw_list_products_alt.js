
import { Sequelize, QueryTypes } from 'sequelize';

// Try 127.0.0.1 and mysql dialect (uses mysql2)
const sequelize = new Sequelize('stationery_store', 'root', '', {
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false
});

async function rawQuery() {
    try {
        await sequelize.authenticate();
        console.log('--- RAW SQL PRODUCTS (127.0.0.1 / mysql) ---');
        const results = await sequelize.query("SELECT * FROM product", { type: QueryTypes.SELECT });
        console.log(JSON.stringify(results, null, 2));
        console.log('----------------');
    } catch (error) {
        console.error("Connection failed:", error.message);
    } finally {
        await sequelize.close();
    }
}

rawQuery();
