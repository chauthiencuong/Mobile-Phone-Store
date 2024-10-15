namespace backend.Model
{
    public class ProductPromotion
    {
        public int Id { get; set; }
        public int ProductVariantId { get; set; }
        public ProductVariant ProductVariant { get; set; } = null!;

        public int PromotionId { get; set; }
        public Promotion Promotion { get; set; } = null!;

        public double PriceSale { get; set; }
        public bool IsActive { get; set; }

    }
}
