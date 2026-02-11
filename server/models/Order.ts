import { Model, DataTypes } from 'sequelize'
import { sequelize } from "../api/connection"

class Order extends Model {
    declare orderID: number
    declare userID: number
    declare totalAmount: number
    declare status: string
}

Order.init({
    orderID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(20),
        defaultValue: 'completed'
    }
}, {
    sequelize,
    tableName: 'orders',
    timestamps: true // Keeps createdAt and updatedAt
})

export { Order }
