import axiosInstance from "./axios";

const apiCart = {
  // Thêm sản phẩm vào giỏ hàng
  addToCart: (userId, productVariantId, quantity) => {
    return axiosInstance.post('/Cart/add', {
      userId,
      productVariantId,
      quantity
    })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
  },

  // Lấy giỏ hàng của người dùng
  getCart: (userId) => {
    return axiosInstance.get(`/Cart/${userId}`)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
  },

  // Xóa sản phẩm khỏi giỏ hàng
  removeFromCart: (userId, productVariantId) => {
    return axiosInstance.delete(`/Cart/remove`, {
      params: {
        userId,
        productVariantId
      }
    })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
  },

  // Xóa toàn bộ giỏ hàng của người dùng
  clearCart: (userId) => {
    return axiosInstance.delete(`/Cart/clear/${userId}`)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
  },

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  updateCart: (userId, productVariantId, newQuantity) => {
    return axiosInstance.put('/Cart/update', {
      userId,
      productVariantId,
      newQuantity
    })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
  }
};

export default apiCart;
