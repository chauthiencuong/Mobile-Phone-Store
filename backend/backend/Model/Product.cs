using Azure;

namespace backend.Model
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Slug { get; set; }
        public int Sku { get; set; }
        public string Description { get; set; }
        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;
        public int BrandId { get; set; }
        public Brand Brand { get; set; } = null!;
        public int Status { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool IsVariant { get; set; }
        public int CreatedBy { get; set; }
        public int UpdatedBy { get; set; }
        public User CreatedByUser { get; set; }
        public User UpdatedByUser { get; set; }
        public ICollection<Gallery> Galleries { get; set; } = new List<Gallery>();
        public ICollection<ProductVariant> ProductVariants { get; set; } = new List<ProductVariant>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();

    }
}
