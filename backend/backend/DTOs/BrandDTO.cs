using backend.Model;

namespace backend.DTOs
{
    public class BrandDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
    public class CreateBrandDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int Status { get; set; }
        public IFormFile ImageFile { get; set; }
    }
}
