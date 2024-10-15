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
  getProductBySlug: (slug) => {
    return axiosInstance.get(`/Product/chi-tiet-san-pham/${slug}`)
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
  getProductsByCategory: (categorySlug, brandSlug = null) => {
    const params = { categorySlug };
    if (brandSlug) {
      params.brandSlug = brandSlug;
    }
    
    return axiosInstance.get('/Product/ProductCategory', { params })
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  },
  getProductsByCategoryAndBrand: (categoryId, brandId) => {
    return axiosInstance.get('/Product')
      .then(response => {
        const products = response.data;
        // Lọc sản phẩm theo categoryId và brandId
        return products.filter(product =>
          product.categoryId === categoryId &&
          product.brandId === brandId
        );
      })
      .catch(error => {
        throw error;
      });
  },
  getProductsByBrandSlug: (brandSlug, categorySlug = null) => {
    const params = { categorySlug };
    return axiosInstance.get(`/Product/ProductBrand/${brandSlug}`, { params })
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  }
};

export default apiProduct;
