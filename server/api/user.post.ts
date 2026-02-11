import { sequelize } from "./connection"
import { User } from "../models/User"
import { reactive } from "vue"
export default defineEventHandler(async (event) => {
    const params = await readBody(event)
    const response = reactive<{
        data?: User[] | User,
        status: boolean
    }>({
        data: [],
        status: false
    })
    try {
        await sequelize.authenticate()
        if (params.fn == "userAuth") {
            const user = await User.findOne({
                where: {
                    userName: params.userName,
                    userPass: sequelize.fn('md5', params.userPass)
                }
            })
            if (user != null) {
                response.data = user
                response.status = true
            }
        } else if (params.fn == "updateProfile") {
            const updateData: any = {
                userFullname: params.userFullname
            }
            // Only update password if provided and not empty
            if (params.userPass && params.userPass.trim() !== "") {
                updateData.userPass = sequelize.fn('md5', params.userPass)
            }

            const result = await User.update(updateData, {
                where: {
                    userID: params.userID
                }
            })

            // Result is [numberOfAffectedRows]
            if (result[0] > 0) {
                const updatedUser = await User.findOne({ where: { userID: params.userID } })
                if (updatedUser) {
                    response.data = updatedUser
                    response.status = true
                }
            }
        } else if (params.fn == "insert") {
            // Check if user already exists
            const existingUser = await User.findOne({
                where: {
                    userName: params.userName
                }
            })

            if (existingUser) {
                return { status: false, message: 'Username/Student ID already exists' }
            }

            // Manual auto-increment to avoid DB issues
            const lastUser = await User.findOne({
                order: [['userID', 'DESC']]
            })
            const nextID = lastUser ? lastUser.userID + 1 : 1

            const newUser = await User.create({
                userID: nextID,
                userName: params.userName,
                userPass: sequelize.fn('md5', params.userPass),
                userFullname: params.userFullname,
                userStatus: 'Student' // Default status for new registrations
            })

            if (newUser) {
                // Fetch the user again to ensure we get the ID and all default fields
                const createdUser = await User.findOne({
                    where: { userName: params.userName }
                })
                if (createdUser) {
                    response.data = createdUser
                    response.status = true
                }
            }
        }
    } catch (error: any) {
        console.error('Unable to connect to the Db:', error)
        return { status: false, message: error.original?.sqlMessage || error.message || 'Database error' }
    }
    return response
})