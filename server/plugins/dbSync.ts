import { sequelize } from "../api/connection"
import { Category } from "../models/Category"
import { Product } from "../models/Product"
import { Order } from "../models/Order"
import { OrderItem } from "../models/OrderItem"
import { User } from "../models/User"

export default defineNitroPlugin(async (nitroApp) => {
    try {
        await sequelize.authenticate()
        console.log('Database connected.')

        // Define associations
        User.hasMany(Order, { foreignKey: 'userID' })
        Order.belongsTo(User, { foreignKey: 'userID', as: 'user' })

        Order.hasMany(OrderItem, { foreignKey: 'orderID' })
        OrderItem.belongsTo(Order, { foreignKey: 'orderID' })

        // Sync models
        // alter: true will create tables if they don't exist, or update columns if they changed
        await User.sync({ alter: true })
        await Category.sync({ alter: true })
        await Product.sync({ alter: true })
        await Order.sync({ alter: true })
        await OrderItem.sync({ alter: true })
        console.log('Database tables synced.')
    } catch (error) {
        console.error('Database connection failed:', error)
    }
})
