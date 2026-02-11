
import { Sequelize, QueryTypes } from 'sequelize';

const sequelize = new Sequelize('stationery_store', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb',
    logging: false
});

async function rawQuery() {
    try {
        await sequelize.authenticate();
        console.log('--- TABLES ---');
        const results = await sequelize.query("SHOW TABLES", { type: QueryTypes.SELECT });
        console.log(JSON.stringify(results, null, 2));
        console.log('----------------');
    } catch (error) {
        console.error(error);
    } finally {
        await sequelize.close();
    }
}

rawQuery();
