import axiosInstance from "./axios";

const apiPromotion = {
    
    getAllPromotions: () => {
        return axiosInstance.get('/Promotion')
            .then(response => response.data)
            .catch(error => {
                throw error;
            });
    },
};

export default apiPromotion;
