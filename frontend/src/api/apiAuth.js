import axiosInstance from './axios';

const apiAuth = {
    // Hàm đăng ký người dùng
    registerUser: (userData) => {
        return axiosInstance.post('/User/register', userData)
            .then(response => {
                return response.data.token;
            })
            .catch(error => {
                throw error.response ? error.response.data : error.message;
            });
    },

    // Hàm đăng nhập người dùng
    loginUser: (userData) => {
        return axiosInstance.post('/User/login', userData)
            .then(response => {
                return response.data.token;
            })
            .catch(error => {
                throw error.response ? error.response.data : error.message;
            });
    },

    getUserInfo: async (token) => {
        try {
            const response = await axiosInstance.post('/User/userInfo', { token });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },
};

export default apiAuth;
