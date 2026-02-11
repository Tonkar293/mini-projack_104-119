import { Category } from "../models/Category"

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const fn = body.fn

    let response = {
        status: false,
        message: ''
    }

    try {
        if (fn === "insert") {
            const newCategory = await Category.create({
                name: body.name,
                description: body.description
            })
            if (newCategory) {
                response.status = true
                response.message = "Category created successfully"
            }
        }
        else if (fn === "update") {
            const result = await Category.update({
                name: body.name,
                description: body.description
            }, {
                where: { categoryID: body.categoryID }
            })

            if (result[0] > 0) {
                response.status = true
                response.message = "Category updated successfully"
            } else {
                response.message = "No category updated"
            }
        }
        else if (fn === "delete") {
            // Check if products exist in this category before deleting?
            // For now, let's allow delete. It might set product's categoryID to NULL if constraint allows, or error.
            // Since we set allowNull: true in Product, it should be fine or we handle the error.

            const result = await Category.destroy({
                where: { categoryID: body.categoryID }
            })

            if (result > 0) {
                response.status = true
                response.message = "Category deleted successfully"
            } else {
                response.message = "No category deleted"
            }
        }
    } catch (error) {
        console.error("Category API Error:", error)
        response.message = "Database error"
    }

    return response
})
