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
};

export default apiPost;
