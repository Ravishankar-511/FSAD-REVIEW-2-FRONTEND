import API from './axiosConfig';

export const categoryService = {
    // Get all categories
    getCategories: async () => {
        try {
            const response = await API.get('/api/categories');
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    // Add a new category
    addCategory: async (categoryData) => {
        try {
            const response = await API.post('/api/categories', categoryData);
            return response.data;
        } catch (error) {
            console.error('Error adding category:', error);
            throw error;
        }
    },

    // Delete a category by ID
    deleteCategory: async (categoryId) => {
        try {
            await API.delete(`/api/categories/${categoryId}`);
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    }
};

export default categoryService;