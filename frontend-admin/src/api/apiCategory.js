import axiosInstance from "./axios";

const apiCategory = {
  getAllCategories: () => {
    return axiosInstance.get('/Category')
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  },
  createCategory: (categoryData) => {
    return axiosInstance.post('/Category', categoryData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
  },
  deleteCategory: (id) => {
    return axiosInstance.delete(`/Category/${id}`)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  },
  updateCategory: (id, categoryData) => {
    return axiosInstance.put(`/Category/${id}`, categoryData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
  },
  getCategoryById: (id) => {
    return axiosInstance.get(`/Category/${id}`)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  },
};

export default apiCategory;
