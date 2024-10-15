import axiosInstance from "./axios";

const apiMenu = {
  getAllMenus: () => {
    return axiosInstance.get('/Menu')
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  },
};

export default apiMenu;
