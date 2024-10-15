import axiosInstance from "./axios";

const apiProductVariant = {
  createProductVariant: (variantData) => {
    return axiosInstance.post('/ProductVariant', variantData)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        throw error;
      });
  },
  getProductVariantsByProductId: (productId) => {
    return axiosInstance.get(`/ProductVariant/Product/${productId}`)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        throw error;
      });
  },
  updateProductVariant: (id, variantData) => {
    return axiosInstance.put(`/ProductVariant/${id}`, variantData)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        throw error;
      });
  },
  deleteProductVariant: (id) => {
    return axiosInstance.delete(`/ProductVariant/${id}`)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  },
};

export default apiProductVariant;
