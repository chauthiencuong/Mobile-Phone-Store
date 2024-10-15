import axiosInstance from "./axios";

const apiOrder = {
  createOrder: (orderData) => {
    return axiosInstance.post('/Order', orderData)
      .then(response => response.data)
      .catch(error => {
        console.error('Error in createOrder:', error.response?.data || error.message);
        throw error;
      });
  },
  createOrderDetail: (orderDetails) => {
    return axiosInstance.post('/OrderDetail', orderDetails)
      .then(response => response.data)
      .catch(error => {
        console.error('Error in createOrderDetail:', error.response?.data || error.message);
        throw error;
      });
  },
  createPaymentMomo: (paymentData) => {
    return axiosInstance.post('/MoMo/PaymentMomo', paymentData)
      .then(response => response.data)
      .catch(error => {
        console.error('Error in createPaymentMomo:', error.response?.data || error.message);
        throw error;
      });
  },
  getOrdersByUserId: (userId) => {
    return axiosInstance.get(`/Order/User/${userId}`)
      .then(response => response.data)
      .catch(error => {
        console.error('Error in getOrdersByUserId:', error.response?.data || error.message);
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
  updateOrderStatus: (id, status) => {
    return axiosInstance.put(`/Order/${id}/status`, { status })
      .then(response => response.data)
      .catch(error => {
        console.error('Error in updateOrderStatus:', error.response?.data || error.message);
        throw error;
      });
  },
};

export default apiOrder;
