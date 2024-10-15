namespace backend.DTOs
{
    public class CreateGalleryDTO
    {
        public int ProductId { get; set; }
        public List<IFormFile> ImageFiles { get; set; }
    }

    public class GalleryDTO
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ImageGallery { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
    public class UpdateGalleryDTO : CreateGalleryDTO
    {
    }
}
