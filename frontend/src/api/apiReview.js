import axiosInstance from "./axios";

const apiReview = {
    getReviewsOfProductId: (productId) => {
        return axiosInstance.get(`/Review/${productId}`)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error("Lỗi:", error);
                throw error;
            });
    },
    createReview: async (reviewData) => {
        try {
            const response = await axiosInstance.post("/Review", reviewData);
            return response.data;
        } catch (error) {
            console.error("Error adding review:", error);
            throw error;
        }
    }
};

export default apiReview;
