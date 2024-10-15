import axiosInstance from "./axios";

const apiColor = {
    getAllColors: () => {
        return axiosInstance.get('/Color')
            .then(response => response.data)
            .catch(error => {
                throw error;
            });
    }
};

export default apiColor;
