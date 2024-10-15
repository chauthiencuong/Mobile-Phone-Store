    namespace backend.Model
    {
        public class Order
        {
            public int Id { get; set; }
            public int UserId { get; set; }
            public User User { get; set; }
            public string Name { get; set; }
            public string Note { get; set; }
            public string ShippingAddress { get; set; }
            public DateTime? CreatedAt { get; set; }
            public double TotalPrice { get; set; }
            public string PaymentMethod { get; set; }  // Phương thức thanh toán (Ví dụ: MoMo, COD,...)
            public OrderStatus Status { get; set; }  // Trạng thái đơn hàng
            public ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
        }

        public class OrderDetail
        {
            public int Id { get; set; }
            public int OrderId { get; set; }
            public Order Order { get; set; }
            public int ProductVariantId { get; set; }
            public ProductVariant ProductVariant { get; set; }
            public int Quantity { get; set; }
            public double Price { get; set; }
        }
        public enum OrderStatus
        {
            Pending,         // Đơn hàng đang chờ xử lý
            Paid,            // Đã thanh toán
            Shipped,         // Đã giao hàng
            Delivered,       // Đã nhận hàng
            Cancelled,       // Đơn hàng đã bị hủy
            Refunded         // Đơn hàng đã được hoàn lại
        }
    }
