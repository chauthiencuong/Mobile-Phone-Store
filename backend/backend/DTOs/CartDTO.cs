namespace backend.DTOs
{
    public class CartDTO
    {
        public int UserId { get; set; }
        public List<CartItemDTO> CartItems { get; set; }
    }

    public class CartItemDTO
    {
        public int ProductVariantId { get; set; }
        public string ProductName { get; set; }
        public string ColorName { get; set; }
        public string ConfigurationName { get; set; }
        public int Quantity { get; set; }
        public double Price { get; set; }
    }
}
