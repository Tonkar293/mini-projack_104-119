import { Model, DataTypes } from 'sequelize'
import { sequelize } from "../api/connection"

class OrderItem extends Model {
    declare itemID: number
    declare orderID: number
    declare productID: number
    declare productName: string
    declare quantity: number
    declare price: number
}

OrderItem.init({
    itemID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    orderID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    productID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    productName: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'order_items',
    timestamps: false
})

export { OrderItem }
