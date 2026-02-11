import { Order } from "../models/Order"
import { OrderItem } from "../models/OrderItem"
import { User } from "../models/User"

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event)
        console.log('Fetching orders with query:', query)
        const whereClause: any = {}
        if (query.userID) {
            whereClause.userID = query.userID
        }
        console.log('Where clause:', whereClause)

        const orders = await Order.findAll({
            where: whereClause,
            include: [
                { model: OrderItem },
                { model: User, as: 'user' }
            ],
            order: [['createdAt', 'DESC']]
        })

        return {
            status: true,
            data: orders
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
        return {
            status: false,
            message: 'Failed to fetch orders'
        }
    }
});
