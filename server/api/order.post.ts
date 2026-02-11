import { Order } from "../models/Order"
import { OrderItem } from "../models/OrderItem"
import { User } from "../models/User"

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { userID, cartItems } = body
    console.log('Received order request:', { userID, cartItemCount: cartItems?.length })

    if (!userID || !cartItems || cartItems.length === 0) {
        console.error('Invalid order data:', { userID, cartItems })
        return { status: false, message: 'Invalid data: Missing User ID or Cart Items' }
    }

    // Check if user exists
    const userExists = await User.findByPk(userID)
    if (!userExists) {
        return { status: false, message: `User with ID ${userID} not found` }
    }

    try {
        let total = 0
        cartItems.forEach((item: any) => {
            total += item.price * item.quantity
        })

        const order = await Order.create({
            userID,
            totalAmount: total,
            status: 'completed'
        })

        for (const item of cartItems) {
            await OrderItem.create({
                orderID: order.orderID,
                productID: item.id,
                productName: item.name,
                quantity: item.quantity,
                price: item.price
            })
        }

        console.log(`Order created successfully: ${order.orderID} for user ${userID}`)
        return { status: true, orderID: order.orderID }

    } catch (error: any) {
        console.error('Order creation failed:', error)
        return { status: false, message: error.message || 'Database error' }
    }
})
