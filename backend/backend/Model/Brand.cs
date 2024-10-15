
namespace backend.Model
{
    public class Brand
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Slug { get; set; }
        public string ImageBrand { get; set; }
        public string Description { get; set; }
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
