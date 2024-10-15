using backend.Model;

namespace backend.DTOs
{
    public class ProductDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Slug { get; set; }
        public int Sku { get; set; }
        public string Description { get; set; }
        public int CategoryId { get; set; }
        public CategoryDTO Category { get; set; } = null!;
        public int BrandId { get; set; }
        public BrandDTO Brand { get; set; } = null!;
        public int Status { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int CreatedBy { get; set; }
        public int UpdatedBy { get; set; }
        public bool IsVariant { get; set; }
        public ICollection<GalleryDTO> Galleries { get; set; } = new List<GalleryDTO>();
        public ICollection<ProductVariantDTO> ProductVariants { get; set; } = new List<ProductVariantDTO>();

    }

    public class CreateProductDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int CategoryId { get; set; }
        public int BrandId { get; set; }
        public int Sku { get; set; }
        public int Status { get; set; }
        public bool IsVariant { get; set; }
    }

    public class UpdateProductDTO : CreateProductDTO
    {
        // Kế thừa từ CreateProductDTO
    }
}
