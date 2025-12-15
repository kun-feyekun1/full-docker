
const productService = {
  getProducts: async (page = 1, limit = 8) => {
    try {
      // Test with fetch first
      const response = await fetch(`http://localhost/api/products?page=${page}&limit=${limit}`);
      const data = await response.json();
      console.log('Fetch test data:', data);
      return data;
    } catch (error) {
      console.error('Fetch test error:', error);
      throw error;
    }
  },
 getProductById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('Fetch product by ID error:', error);
      throw error;
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/createProd`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('Create product error:', error);
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/updateProd/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('Update product error:', error);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      const data = text ? JSON.parse(text) : { message: 'Product deleted successfully' };
      
      return { data };
    } catch (error) {
      console.error('Delete product error:', error);
      throw error;
    }
  },
};

export default productService;