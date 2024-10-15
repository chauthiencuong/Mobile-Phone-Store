import axiosInstance from "./axios";

const apiCategory = {
  getAllCategories: () => {
    return axiosInstance.get('/Category')
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  },
};

export default apiCategory;
