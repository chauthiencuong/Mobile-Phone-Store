import axiosInstance from "./axios";

const apiMenu = {
  getAllMenus: () => {
    return axiosInstance.get('/Menu')
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  },

  getMenuById: (id) => {
    return axiosInstance.get(`/Menu/${id}`)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  },
  
  createMenu: (menuData) => {
    return axiosInstance.post('/Menu', menuData)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  },
  updateMenu: (id, menuData) => {
    return axiosInstance.put(`/Menu/${id}`, menuData)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
  },
  deleteMenu: (id) => {
    return axiosInstance.delete(`/Menu/${id}`)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  },
};

export default apiMenu;
