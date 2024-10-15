import axiosInstance from "./axios";

const apiProductPromotion = {
    createProductPromotion: (productPromotionData) => {
        return axiosInstance.post('/ProductPromotion/apply', productPromotionData)
            .then(response => response.data)
            .catch(error => {
                throw error;
            });
    },

    // Thêm phương thức để lấy thông tin khuyến mãi theo productId
    getPromotionsByProductId: (productId) => {
        return axiosInstance.get(`/ProductPromotion/Product/${productId}`)
            .then(response => response.data)
            .catch(error => {
                throw error;
            });
    }
};

export default apiProductPromotion;
