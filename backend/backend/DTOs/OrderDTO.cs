using backend.Model;

namespace backend.DTOs
{
    public class OrderDTO
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Note { get; set; }
        public string ShippingAddress { get; set; }
        public DateTime? CreatedAt { get; set; }
        public double TotalPrice { get; set; }
        public string PaymentMethod { get; set; }
        public OrderStatus Status { get; set; }
        public List<OrderDetailDTO> OrderDetails { get; set; } = new List<OrderDetailDTO>();
    }

    public class OrderDetailDTO
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int ProductVariantId { get; set; }
        public int Quantity { get; set; }
        public double Price { get; set; }
    }
        public class CreateOrderDTO
        {
            public int UserId { get; set; }
            public string Name { get; set; }
            public string Note { get; set; }
            public string ShippingAddress { get; set; }
            public double TotalPrice { get; set; }
            public string PaymentMethod { get; set; }
            public OrderStatus Status { get; set; }
        }
        public class UpdateOrderDTO : CreateOrderDTO
        {
        }
    public class UpdateOrderStatusDTO
    {
        public int Status { get; set; }
    }


    public class CreateOrderDetailDTO
        {
            public int OrderId { get; set; }
            public int ProductVariantId { get; set; }
            public int Quantity { get; set; }
            public double Price { get; set; }
        }
}

