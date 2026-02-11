import { sequelize } from "./connection"
import { Product } from "../models/Product"

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const fn = body.fn

    let response = {
        status: false,
        message: ''
    }

    try {
        if (fn === "insert") {
            const newProduct = await Product.create({
                name: body.name,
                details: body.details,
                price: body.price,
                quantity: body.quantity,
                image: body.image,
                type: body.type,
                categoryID: body.categoryID
            })
            if (newProduct) {
                response.status = true
                response.message = "Product created successfully"
            }
        }
        else if (fn === "update") {
            const result = await Product.update({
                name: body.name,
                details: body.details,
                price: body.price,
                quantity: body.quantity,
                image: body.image,
                type: body.type,
                categoryID: body.categoryID
            }, {
                where: { productID: body.productID }
            })

            if (result[0] > 0) {
                response.status = true
                response.message = "Product updated successfully"
            } else {
                response.message = "No product updated"
            }
        }
        else if (fn === "delete") {
            const result = await Product.destroy({
                where: { productID: body.productID }
            })

            if (result > 0) {
                response.status = true
                response.message = "Product deleted successfully"
            } else {
                response.message = "No product deleted"
            }
        }
    } catch (error) {
        console.error("Product API Error:", error)
        response.message = "Database error"
    }

    return response
})
