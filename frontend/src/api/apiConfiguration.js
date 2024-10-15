import axiosInstance from "./axios";

const apiConfiguration = {
    getAllConfigurations: () => {
        return axiosInstance.get('/Configuration')
            .then(response => response.data)
            .catch(error => {
                throw error;
            });
    }
};

export default apiConfiguration;
