namespace backend.Model
{
    public class Cart
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = null!; 
        public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    }

    public class CartItem
    {
        public int Id { get; set; }
        public int CartId { get; set; }
        public Cart Cart { get; set; } = null!;
        public int ProductVariantId { get; set; }
        public ProductVariant ProductVariant { get; set; } = null!;
        public int Quantity { get; set; }
        public double Price { get; set; } // Giá thực tế lưu vào cart (có thể là giá khuyến mãi hoặc giá gốc)
    }
}
