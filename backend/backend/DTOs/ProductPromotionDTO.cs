namespace backend.DTOs
 {
   public class ProductPromotionDTO
   {
          public int Id { get; set; }
          public int ProductVariantId { get; set; }
          public int PromotionId { get; set; }
          public PromotionDTO Promotion { get; set; }
          public double PriceSale { get; set; }
          public bool IsActive { get; set; }
    }
    public class CreateProductPromotionDTO
    {
        public int ProductVariantId { get; set; }
        public int PromotionId { get; set; }
        public bool IsActive { get; set; }
    }
}


