import axiosInstance from "./axios";

const apiPost = {
  getAllPosts: () => {
    return axiosInstance.get('/Post')
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  },

  getPostById: (id) => {
    return axiosInstance.get(`/Post/${id}`)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  },
  
  createPost: (postData) => {
    return axiosInstance.post('/Post', postData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
  },
  updatePost: (id, postData) => {
    return axiosInstance.put(`/Post/${id}`, postData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
  },
  deletePost: (id) => {
    return axiosInstance.delete(`/Post/${id}`)
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  },
};

export default apiPost;
