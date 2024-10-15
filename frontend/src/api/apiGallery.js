import axiosInstance from "./axios";

const apiGallery = {
  getGalleriesByProductId: (productId) => {
    if (!productId) {
      throw new Error("productId is null or undefined");
    }

    return axiosInstance.get(`/Gallery/${productId}`)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.error("Error fetching galleries by productId:", error);
        throw error;
      });
  }
};

export default apiGallery;
