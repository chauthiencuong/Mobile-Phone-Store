import axiosInstance from "./axios";

const apiConfiguration = {
    createConfiguration: (configData) => {
        return axiosInstance.post('/Configuration', configData)
            .then(response => response.data)
            .catch(error => {
                throw error;
            });
    },
    getAllConfigurations: () => {
        return axiosInstance.get('/Configuration')
            .then(response => response.data)
            .catch(error => {
                throw error;
            });
    }
};

export default apiConfiguration;
