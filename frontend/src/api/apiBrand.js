import axiosInstance from "./axios";

const apiBrand = {
  getAllBrands: () => {
    return axiosInstance.get('/Brand')
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  },
};

export default apiBrand;
