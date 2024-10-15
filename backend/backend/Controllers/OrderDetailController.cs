using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderDetailController : ControllerBase
    {
        private readonly OrderDetailService _orderDetailService;

        public OrderDetailController(OrderDetailService orderDetailService)
        {
            _orderDetailService = orderDetailService;
        }

        // Tạo chi tiết đơn hàng mới
        [HttpPost]
        public async Task<IActionResult> CreateOrderDetail([FromBody] List<CreateOrderDetailDTO> orderDetailDtos)
        {
            if (orderDetailDtos == null || !orderDetailDtos.Any())
            {
                return BadRequest("Danh sách chi tiết đơn hàng không hợp lệ.");
            }

            try
            {
                var createdOrderDetails = await _orderDetailService.CreateOrderDetailsAsync(orderDetailDtos);
                return CreatedAtAction(nameof(GetOrderDetailsByOrderId), new { orderId = createdOrderDetails.First().OrderId }, createdOrderDetails);
            }
            catch (Exception ex) when (ex is KeyNotFoundException || ex is InvalidOperationException)
            {
                return NotFound();
            }
        }

        // Cập nhật chi tiết đơn hàng
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrderDetail(int id, [FromBody] OrderDetailDTO orderDetailDto)
        {
            try
            {
                var updatedOrderDetail = await _orderDetailService.UpdateOrderDetailAsync(id, orderDetailDto);
                return Ok(updatedOrderDetail);
            }
            catch (Exception ex) when (ex is KeyNotFoundException || ex is InvalidOperationException)
            {
                return NotFound();
            }
        }

        // Xóa chi tiết đơn hàng
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrderDetail(int id)
        {
            try
            {
                await _orderDetailService.DeleteOrderDetailAsync(id);
                return NoContent();
            }
            catch (Exception ex) when (ex is KeyNotFoundException || ex is InvalidOperationException)
            {
                return NotFound();
            }
        }

        /* Lấy thông tin chi tiết đơn hàng theo ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderDetailById(int id)
        {
            var orderDetail = await _orderDetailService.GetOrderDetailByIdAsync(id);

            if (orderDetail == null)
                return NotFound();

            return Ok(orderDetail);
        }
        */

        // Lấy tất cả chi tiết đơn hàng theo OrderId
        [HttpGet("{orderId}")]
        public async Task<IActionResult> GetOrderDetailsByOrderId(int orderId)
        {
            var orderDetails = await _orderDetailService.GetOrderDetailsByOrderIdAsync(orderId);

            if (orderDetails == null || !orderDetails.Any())
                return NotFound();

            return Ok(orderDetails);
        }
    }
}
