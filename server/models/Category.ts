import { Model, DataTypes } from 'sequelize'
import { sequelize } from "../api/connection"

class Category extends Model {
    declare categoryID: number
    declare name: string
    declare description: string
}

Category.init({
    categoryID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    sequelize,
    tableName: 'category',
    timestamps: false
})

export { Category }
