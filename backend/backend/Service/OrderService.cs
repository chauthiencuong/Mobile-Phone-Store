using backend.Data;
using backend.DTOs;
using backend.Model;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Services
{
    public class OrderService
    {
        private readonly DataContext _context;

        public OrderService(DataContext context)
        {
            _context = context;
        }

        // Tạo đơn hàng mới
        public async Task<OrderDTO> CreateOrderAsync(CreateOrderDTO createOrderDto)
        {
            var order = new Order
            {
                UserId = createOrderDto.UserId,
                Name = createOrderDto.Name,
                Note = createOrderDto.Note,
                ShippingAddress = createOrderDto.ShippingAddress,
                CreatedAt = DateTime.Now,
                TotalPrice = createOrderDto.TotalPrice,
                PaymentMethod = createOrderDto.PaymentMethod,
                Status = createOrderDto.Status
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return new OrderDTO
            {
                Id = order.Id,
                UserId = order.UserId,
                Name = order.Name,
                Note = order.Note,
                ShippingAddress = order.ShippingAddress,
                CreatedAt = order.CreatedAt,
                TotalPrice = order.TotalPrice,
                PaymentMethod = order.PaymentMethod,
                Status = order.Status
            };
        }

        // Cập nhật thông tin đơn hàng
        public async Task<OrderDTO> UpdateOrderAsync(int id, UpdateOrderDTO updateOrderDto)
        {
            var order = await _context.Orders
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                throw new KeyNotFoundException("Đơn hàng không tồn tại.");

            order.Name = updateOrderDto.Name;
            order.Note = updateOrderDto.Note;
            order.ShippingAddress = updateOrderDto.ShippingAddress;
            order.TotalPrice = updateOrderDto.TotalPrice;
            order.PaymentMethod = updateOrderDto.PaymentMethod;
            order.Status = updateOrderDto.Status;

            await _context.SaveChangesAsync();

            return new OrderDTO
            {
                Id = order.Id,
                UserId = order.UserId,
                Name = order.Name,
                Note = order.Note,
                ShippingAddress = order.ShippingAddress,
                CreatedAt = order.CreatedAt,
                TotalPrice = order.TotalPrice,
                PaymentMethod = order.PaymentMethod,
                Status = order.Status
            };
        }

        // Xóa đơn hàng
        public async Task DeleteOrderAsync(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderDetails)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                throw new KeyNotFoundException("Đơn hàng không tồn tại.");

            // Xóa các chi tiết đơn hàng liên quan
            _context.OrderDetails.RemoveRange(order.OrderDetails);

            // Xóa đơn hàng
            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
        }

        // Lấy thông tin đơn hàng theo ID
        public async Task<OrderDTO> GetOrderByIdAsync(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderDetails)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return null;

            return new OrderDTO
            {
                Id = order.Id,
                UserId = order.UserId,
                Name = order.Name,
                Note = order.Note,
                ShippingAddress = order.ShippingAddress,
                CreatedAt = order.CreatedAt,
                TotalPrice = order.TotalPrice,
                PaymentMethod = order.PaymentMethod,
                Status = order.Status,
                OrderDetails = order.OrderDetails.Select(od => new OrderDetailDTO
                {
                    Id = od.Id,
                    OrderId = od.OrderId,
                    ProductVariantId = od.ProductVariantId,
                    Quantity = od.Quantity,
                    Price = od.Price
                }).ToList()
            };
        }

        // Lấy tất cả các đơn hàng
        public async Task<List<OrderDTO>> GetAllOrdersAsync()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderDetails)
                .ToListAsync();

            return orders.Select(o => new OrderDTO
            {
                Id = o.Id,
                UserId = o.UserId,
                Name = o.Name,
                Note = o.Note,
                ShippingAddress = o.ShippingAddress,
                CreatedAt = o.CreatedAt,
                TotalPrice = o.TotalPrice,
                PaymentMethod = o.PaymentMethod,
                Status = o.Status,
                OrderDetails = o.OrderDetails.Select(od => new OrderDetailDTO
                {
                    Id = od.Id,
                    OrderId = od.OrderId,
                    ProductVariantId = od.ProductVariantId,
                    Quantity = od.Quantity,
                    Price = od.Price
                }).ToList()
            }).ToList();
        }
        // Lấy đơn hàng của người dùng
        // Lấy các đơn hàng dựa vào UserId
        public async Task<List<OrderDTO>> GetOrdersByUserIdAsync(int userId)
        {
            var orders = await _context.Orders
                .Include(o => o.OrderDetails)
                .Where(o => o.UserId == userId)
                .ToListAsync();

            return orders.Select(o => new OrderDTO
            {
                Id = o.Id,
                UserId = o.UserId,
                Name = o.Name,
                Note = o.Note,
                ShippingAddress = o.ShippingAddress,
                CreatedAt = o.CreatedAt,
                TotalPrice = o.TotalPrice,
                PaymentMethod = o.PaymentMethod,
                Status = o.Status,
                OrderDetails = o.OrderDetails.Select(od => new OrderDetailDTO
                {
                    Id = od.Id,
                    OrderId = od.OrderId,
                    ProductVariantId = od.ProductVariantId,
                    Quantity = od.Quantity,
                    Price = od.Price
                }).ToList()
            }).ToList();
        }
        public async Task<OrderDTO> UpdateStatusOrderAsync(int id, int status)
        {
            var order = await _context.Orders
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                throw new KeyNotFoundException("Đơn hàng không tồn tại.");

            // Chỉ cập nhật trường status
            order.Status = (OrderStatus)status;

            await _context.SaveChangesAsync();

            return new OrderDTO
            {
                Id = order.Id,
                UserId = order.UserId,
                Name = order.Name,
                Note = order.Note,
                ShippingAddress = order.ShippingAddress,
                CreatedAt = order.CreatedAt,
                TotalPrice = order.TotalPrice,
                PaymentMethod = order.PaymentMethod,
                Status = order.Status,
                // Không cần cập nhật OrderDetails trong trường hợp này
                OrderDetails = order.OrderDetails.Select(od => new OrderDetailDTO
                {
                    Id = od.Id,
                    OrderId = od.OrderId,
                    ProductVariantId = od.ProductVariantId,
                    Quantity = od.Quantity,
                    Price = od.Price
                }).ToList()
            };
        }

    }
}
