import { Category } from "../models/Category";

export default defineEventHandler(async (event) => {
    try {
        const categories = await Category.findAll();
        return {
            status: true,
            data: categories
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
        return {
            status: false,
            message: 'Failed to fetch categories'
        }
    }
});
