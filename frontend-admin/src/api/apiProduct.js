import axiosInstance from "./axios";

const apiProduct = {
  getAllProducts: () => {
    return axiosInstance.get('/Product')
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  },

  getProductById: (id) => {
    return axiosInstance.get(`/Product/${id}`)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  },
  
  createProduct: (productData) => {
    return axiosInstance.post('/Product', productData)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  },
  updateProduct: (id, productData) => {
    return axiosInstance.put(`/Product/${id}`, productData)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
  },
  deleteProduct: (id) => {
    return axiosInstance.delete(`/Product/${id}`)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  },
};

export default apiProduct;
