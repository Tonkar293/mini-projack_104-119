import { Product } from "../models/Product";
import { Category } from "../models/Category";

export default defineEventHandler(async (event) => {
    try {
        const products = await Product.findAll({
            include: [{
                model: Category,
                attributes: ['name'] // Only fetch the category name
            }]
        });
        return {
            status: true,
            data: products
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        return {
            status: false,
            message: 'Failed to fetch products'
        }
    }
});
