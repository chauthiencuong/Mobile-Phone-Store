namespace backend.Model
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Slug { get; set; }
        public string? ImageCategory { get; set; }
        public string Description { get; set; }
        public int Parent_id { get; set; }
        public int Status { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int CreatedBy { get; set; }
        public int UpdatedBy { get; set; }
        public User CreatedByUser { get; set; }
        public User UpdatedByUser { get; set; }
        public ICollection<Product> Products { get; } = new List<Product>();
       
    }
}
