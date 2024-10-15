import axiosInstance from "./axios";

const apiGallery = {
  createGallery: (formData) => {
    return axiosInstance.post('/Gallery', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
  },
  getGalleriesByProductId: (productId) => {
    return axiosInstance.get(`/Gallery/${productId}`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
  },
  updateGallery: (productId, formData) => {
    return axiosInstance.put(`/Gallery/${productId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
  }
};

export default apiGallery;
