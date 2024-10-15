import axiosInstance from "./axios";

const apiColor = {
    createColor: (colorData) => {
        return axiosInstance.post('/Color', colorData)
            .then(response => response.data)
            .catch(error => {
                throw error;
            });
    },
    getAllColors: () => {
        return axiosInstance.get('/Color')
            .then(response => response.data)
            .catch(error => {
                throw error;
            });
    }
};

export default apiColor;
