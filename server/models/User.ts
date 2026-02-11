import { Model, DataTypes } from 'sequelize'
import { sequelize } from "../api/connection";

class User extends Model {
    declare userID: number;
    declare userName: string;
    declare userPass: string;
    declare userStatus: string;
    declare userFullname: string;
}

User.init(
    {
        userID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
        },
        userName: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        userPass: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        userStatus: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        userFullname: {
            type: DataTypes.STRING(200),
            allowNull: false
        }
    },
    {
        tableName: 'user',
        createdAt: false,
        updatedAt: false,
        deletedAt: false,
        sequelize
    },
);

export { User }