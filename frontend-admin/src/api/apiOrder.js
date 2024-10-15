import axiosInstance from "./axios";

const apiOrder = {
  getAllOrders: () => {
    return axiosInstance.get('/Order')
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  },
  getOrderById: (id) => {
    return axiosInstance.get(`/Order/${id}`)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  },
  getOrderDetailsByOrderId: (orderId) => {
    return axiosInstance.get(`/OrderDetail/${orderId}`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
  },
  deleteOrder: (id) => {
    return axiosInstance.delete(`/Order/${id}`)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  },
  updateOrder: (id, orderData) => {
    return axiosInstance.put(`/Order/${id}`, orderData)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
  },
};

export default apiOrder;
