import axiosInstance from "./axios";

const apiBanner = {
  getAllBanners: () => {
    return axiosInstance.get('/Banner')
        .then(response => {
            return response.data;
        })
        .catch(error => {
            throw error;
        });
    }
};

export default apiBanner;
