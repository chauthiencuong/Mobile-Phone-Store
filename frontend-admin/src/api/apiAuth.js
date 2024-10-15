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
    adminLogin: (userData) => {
        return axiosInstance.post('/User/adminLogin', userData)
            .then(response => {
                return response.data.token;
            })
            .catch(error => {
                throw error.response ? error.response.data : error.message;
            });
    },

    // Hàm lấy thông tin người dùng từ token
    getUserInfo: async (token) => {
        try {
            const response = await axiosInstance.post('/User/userInfo', { token });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },
    getAllUsers: () => {
        return axiosInstance.get('/User')
          .then(response => response.data)
          .catch(error => {
            throw error;
          });
      },
      getUserById: (id) => {
        return axiosInstance.get(`/User/${id}`)
          .then(response => response.data)
          .catch(error => {
            throw error;
          });
      },
      updateUser: (id, userData) => {
        return axiosInstance.put(`/User/${id}`, userData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => response.data)
        .catch(error => {
          throw error;
        });
      },
      deleteUser: (id) => {
        return axiosInstance.delete(`/User/${id}`)
          .then(response => response.data)
          .catch(error => {
            throw error;
          });
      },
      createUser: (userData) => {
        return axiosInstance.post('/User/add-admin', userData)
          .then(response => response.data)
          .catch(error => {
            throw error;
          });
      },
};

export default apiAuth;
