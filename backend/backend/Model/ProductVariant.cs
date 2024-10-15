namespace backend.Model
{
    public class ProductVariant
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;

        public int? ColorId { get; set; }
        public Color? Color { get; set; }

        public int? ConfigurationId { get; set; }
        public Configuration? Configuration { get; set; }
        public double Price { get; set; }
        public int Qty { get; set; }
        public ICollection<ProductPromotion> ProductPromotions { get; set; } = new List<ProductPromotion>();

    }
}
