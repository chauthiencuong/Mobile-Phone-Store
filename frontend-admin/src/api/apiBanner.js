import axiosInstance from "./axios";

const apiBanner = {
  getAllBanners: () => {
    return axiosInstance.get('/Banner')
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  },
  createBanner: (bannerData) => {
    return axiosInstance.post('/Banner', bannerData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
  },
  deleteBanner: (id) => {
    return axiosInstance.delete(`/Banner/${id}`)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  },
  updateBanner: (id, bannerData) => {
    return axiosInstance.put(`/Banner/${id}`, bannerData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
  },
  getBannerById: (id) => {
    return axiosInstance.get(`/Banner/${id}`)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  },
};

export default apiBanner;
