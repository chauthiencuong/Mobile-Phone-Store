import axiosInstance from "./axios";

const apiPromotion = {
    createPromotion: (promotionData) => {
        return axiosInstance.post('/Promotion', promotionData)
            .then(response => response.data)
            .catch(error => {
                throw error;
            });
    },
    getAllPromotions: () => {
        return axiosInstance.get('/Promotion')
            .then(response => response.data)
            .catch(error => {
                throw error;
            });
    },
    getPromotionById: (id) => {
        return axiosInstance.get(`/Promotion/${id}`)
            .then(response => response.data)
            .catch(error => {
                throw error;
            });
    },
    updatePromotion: (id, promotionData) => {
        return axiosInstance.put(`/Promotion/${id}`, promotionData)
            .then(response => response.data)
            .catch(error => {
                throw error;
            });
    },
    deletePromotion: (id) => {
        return axiosInstance.delete(`/Promotion/${id}`)
          .then(response => response.data)
          .catch(error => {
            throw error;
          });
      },
};

export default apiPromotion;
