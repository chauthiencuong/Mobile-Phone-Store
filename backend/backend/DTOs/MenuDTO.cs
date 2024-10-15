using backend.Model;

namespace backend.DTOs
{
    public class MenuDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Slug { get; set; }
        public string Link { get; set; }
        public int Status { get; set; }
    }
    public class CreateMenuDTO
    {
        public string Name { get; set; }
        public string Link { get; set; }
        public int Status { get; set; }
    }
}
