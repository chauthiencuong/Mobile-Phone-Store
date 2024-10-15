import axiosInstance from "./axios";

const apiBrand = {
  getAllBrands: () => {
    return axiosInstance.get('/Brand')
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  },
  createBrand: (brandData) => {
    return axiosInstance.post('/Brand', brandData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
  },
  deleteBrand: (id) => {
    return axiosInstance.delete(`/Brand/${id}`)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  },
  updateBrand: (id, brandData) => {
    return axiosInstance.put(`/Brand/${id}`, brandData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
  },
  getBrandById: (id) => {
    return axiosInstance.get(`/Brand/${id}`)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  },
};

export default apiBrand;
