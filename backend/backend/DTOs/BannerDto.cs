
namespace backend.Model
{
    public class BannerDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int Status { get; set; }
        public IFormFile ImageFile { get; set; }
    }
}
