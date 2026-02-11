
import { Order } from "../models/Order";
import { OrderItem } from "../models/OrderItem";
import { User } from "../models/User";
import { sequelize } from "../api/connection";

async function run() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Manually define associations to simulate dbSync
        User.hasMany(Order, { foreignKey: 'userID' });
        Order.belongsTo(User, { foreignKey: 'userID', as: 'user' });

        Order.hasMany(OrderItem, { foreignKey: 'orderID' });
        OrderItem.belongsTo(Order, { foreignKey: 'orderID' });

        console.log('Associations defined.');

        // Fetch all orders
        const orders = await Order.findAll({
            include: [
                { model: OrderItem },
                { model: User, as: 'user' }
            ],
            order: [['createdAt', 'DESC']]
        });

        console.log(`Found ${orders.length} orders.`);
        if (orders.length > 0) {
            console.log('First order:', JSON.stringify(orders[0], null, 2));
        } else {
            console.log('No orders found.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

run();
