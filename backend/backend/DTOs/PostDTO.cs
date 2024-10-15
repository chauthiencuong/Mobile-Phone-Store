
namespace backend.Model
{
    public class PostDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ImagePost { get; set; }
        public string Description1 { get; set; }
        public string Description2 { get; set; }
        public string Description3 { get; set; }
        public string Description4 { get; set; }
        public int Status { get; set; }
    }
    public class CreatePostDTO
    {
        public string Name { get; set; }
        public string Description1 { get; set; }
        public string Description2 { get; set; }
        public string Description3 { get; set; }
        public string Description4 { get; set; }
        public IFormFile ImageFile { get; set; }
        public int Status { get; set; }
    }
}
