
import { Sequelize, QueryTypes } from 'sequelize';

const sequelize = new Sequelize('stationery_store', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb',
    logging: false
});

async function checkCounts() {
    try {
        await sequelize.authenticate();
        console.log('--- ROW COUNTS ---');
        const users = await sequelize.query("SELECT COUNT(*) as count FROM user", { type: QueryTypes.SELECT });
        const products = await sequelize.query("SELECT COUNT(*) as count FROM product", { type: QueryTypes.SELECT });
        const orders = await sequelize.query("SELECT COUNT(*) as count FROM orders", { type: QueryTypes.SELECT });

        console.log('Users:', users[0].count);
        console.log('Products:', products[0].count);
        console.log('Orders:', orders[0].count);
        console.log('----------------');
    } catch (error) {
        console.error(error);
    } finally {
        await sequelize.close();
    }
}

checkCounts();
