using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Model
{
    public class Gallery
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public string ImageGallery { get; set; }
        [NotMapped]
        public List<IFormFile> ImageFiles { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

    }
}
