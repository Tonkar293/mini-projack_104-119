import { Model, DataTypes } from 'sequelize'
import { sequelize } from "../api/connection"

import { Category } from './Category'

class Product extends Model {
    declare productID: number
    declare name: string
    declare details: string
    declare price: number
    declare quantity: number
    declare image: string
    declare type: string
    declare categoryID: number // Add categoryID
}

Product.init({
    productID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    details: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    image: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    type: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    categoryID: { // Add categoryID column configuration
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Category,
            key: 'categoryID'
        }
    }
}, {
    sequelize,
    tableName: 'product',
    timestamps: true,
    paranoid: true
})

// Setup Associations
Product.belongsTo(Category, { foreignKey: 'categoryID' })
Category.hasMany(Product, { foreignKey: 'categoryID' })

export { Product }
