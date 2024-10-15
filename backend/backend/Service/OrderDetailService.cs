using backend.Data;
using backend.DTOs;
using backend.Model;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Services
{
    public class OrderDetailService
    {
        private readonly DataContext _context;

        public OrderDetailService(DataContext context)
        {
            _context = context;
        }
        // Tạo chi tiết đơn hàng mới cho nhiều sản phẩm
        public async Task<List<CreateOrderDetailDTO>> CreateOrderDetailsAsync(List<CreateOrderDetailDTO> orderDetailDtos)
        {
            // Tạo danh sách OrderDetail từ DTO
            var orderDetails = orderDetailDtos.Select(dto => new OrderDetail
            {
                OrderId = dto.OrderId,
                ProductVariantId = dto.ProductVariantId,
                Quantity = dto.Quantity,
                Price = dto.Price
            }).ToList();

            // Thêm OrderDetail vào cơ sở dữ liệu
            _context.OrderDetails.AddRange(orderDetails);

            // Cập nhật số lượng ProductVariant
            foreach (var detail in orderDetails)
            {
                var productVariant = await _context.ProductVariants
                    .FirstOrDefaultAsync(pv => pv.Id == detail.ProductVariantId);

                if (productVariant == null)
                    throw new KeyNotFoundException($"ProductVariant with ID {detail.ProductVariantId} not found.");

                // Giảm số lượng tồn kho
                productVariant.Qty -= detail.Quantity;

                // Kiểm tra số lượng còn lại
                if (productVariant.Qty < 0)
                {
                    throw new InvalidOperationException($"Insufficient stock for ProductVariant with ID {detail.ProductVariantId}.");
                }

                // Cập nhật ProductVariant trong cơ sở dữ liệu
                _context.ProductVariants.Update(productVariant);
            }

            // Lưu thay đổi vào cơ sở dữ liệu
            await _context.SaveChangesAsync();

            // Trả về danh sách OrderDetailDTO
            return orderDetails.Select(od => new CreateOrderDetailDTO
            {
                OrderId = od.OrderId,
                ProductVariantId = od.ProductVariantId,
                Quantity = od.Quantity,
                Price = od.Price
            }).ToList();
        }


        // Cập nhật chi tiết đơn hàng
        public async Task<OrderDetailDTO> UpdateOrderDetailAsync(int id, OrderDetailDTO orderDetailDto)
        {
            var orderDetail = await _context.OrderDetails.FirstOrDefaultAsync(od => od.Id == id);

            if (orderDetail == null)
                throw new KeyNotFoundException("Chi tiết đơn hàng không tồn tại.");

            orderDetail.OrderId = orderDetailDto.OrderId;
            orderDetail.ProductVariantId = orderDetailDto.ProductVariantId;
            orderDetail.Quantity = orderDetailDto.Quantity;
            orderDetail.Price = orderDetailDto.Price;

            await _context.SaveChangesAsync();

            return new OrderDetailDTO
            {
                Id = orderDetail.Id,
                OrderId = orderDetail.OrderId,
                ProductVariantId = orderDetail.ProductVariantId,
                Quantity = orderDetail.Quantity,
                Price = orderDetail.Price
            };
        }

        // Xóa chi tiết đơn hàng
        public async Task DeleteOrderDetailAsync(int id)
        {
            var orderDetail = await _context.OrderDetails.FirstOrDefaultAsync(od => od.Id == id);

            if (orderDetail == null)
                throw new KeyNotFoundException("Chi tiết đơn hàng không tồn tại.");

            _context.OrderDetails.Remove(orderDetail);
            await _context.SaveChangesAsync();
        }

        // Lấy thông tin chi tiết đơn hàng theo ID
        public async Task<OrderDetailDTO> GetOrderDetailByIdAsync(int id)
        {
            var orderDetail = await _context.OrderDetails
                .FirstOrDefaultAsync(od => od.Id == id);

            if (orderDetail == null)
                return null;

            return new OrderDetailDTO
            {
                Id = orderDetail.Id,
                OrderId = orderDetail.OrderId,
                ProductVariantId = orderDetail.ProductVariantId,
                Quantity = orderDetail.Quantity,
                Price = orderDetail.Price
            };
        }

        // Lấy tất cả các chi tiết đơn hàng của một đơn hàng
        public async Task<List<OrderDetailDTO>> GetOrderDetailsByOrderIdAsync(int orderId)
        {
            var orderDetails = await _context.OrderDetails
                .Where(od => od.OrderId == orderId)
                .ToListAsync();

            return orderDetails.Select(od => new OrderDetailDTO
            {
                Id = od.Id,
                OrderId = od.OrderId,
                ProductVariantId = od.ProductVariantId,
                Quantity = od.Quantity,
                Price = od.Price
            }).ToList();
        }
    }
}
