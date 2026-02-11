
import { Sequelize, QueryTypes } from 'sequelize';

const sequelize = new Sequelize('stationery_store', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb',
    logging: false
});

async function rawQuery() {
    try {
        await sequelize.authenticate();
        console.log('--- RAW SQL PRODUCTS (fixed) ---');
        const results = await sequelize.query("SELECT * FROM product", { type: QueryTypes.SELECT });
        console.log(JSON.stringify(results, null, 2));
        console.log('----------------');
    } catch (error) {
        console.error(error);
    } finally {
        await sequelize.close();
    }
}

rawQuery();
