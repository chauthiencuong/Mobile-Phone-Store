namespace backend.DTOs
{
    public class CategoryDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Slug { get; set; }
        public string? ImageCategory { get; set; }
        public int Status { get; set; }
        public int Parent_id { get; set; }
        public string Description { get; set; }

    }

    public class CreateCategoryDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int Parent_id { get; set; }
        public int Status { get; set; }
        public IFormFile? ImageFile { get; set; }
    }
}
