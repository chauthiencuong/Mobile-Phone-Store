using System.Text.Json.Serialization;

namespace backend.DTOs
{
    public class ProductVariantDTO
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        [JsonIgnore]
        public ProductDTO Product { get; set; } = null!;
        public int? ColorId { get; set; }
        public ColorDTO? Color { get; set; }
        public int? ConfigurationId { get; set; }
        public ConfigurationDTO? Configuration { get; set; }
        public double Price { get; set; }
        public int Qty { get; set; }
    }
    public class CreateProductVariantDTO
    {
        public int ProductId { get; set; }
        public int? ColorId { get; set; }
        public int? ConfigurationId { get; set; }
        public double Price { get; set; }
        public int Qty { get; set; }
    }
    public class UpdateProductVariantDTO : CreateProductVariantDTO
    {
    }
}
