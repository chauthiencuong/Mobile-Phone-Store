    import axiosInstance from "./axios";

    const apiProductPromotion = {
        getAllProductPromotions: async () => {
            try {
                const response = await axiosInstance.get('/api/ProductPromotion');
                return response.data; 
            } catch (error) {
                console.error("Đã xảy ra lỗi khi lấy danh sách khuyến mãi sản phẩm:", error);
                throw error;
            }
        },
    };

    export default apiProductPromotion;
