using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly OrderService _orderService;

        public OrderController(OrderService orderService)
        {
            _orderService = orderService;
        }

        // Tạo đơn hàng mới
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDTO createOrderDto)
        {
            try
            {
                var order = await _orderService.CreateOrderAsync(createOrderDto);
                return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, order);
            }
            catch (Exception ex) when (ex is InvalidOperationException || ex is KeyNotFoundException)
            {
                return BadRequest(ex.Message); // Hoặc sử dụng StatusCode(400) để phù hợp với lỗi.
            }

        }

        // Cập nhật thông tin đơn hàng
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] UpdateOrderDTO updateOrderDTO)
        {
            try
            {
                var updatedOrder = await _orderService.UpdateOrderAsync(id, updateOrderDTO);
                return Ok(updatedOrder);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex) when (ex is InvalidOperationException)
            {
                return BadRequest(ex.Message); // Hoặc StatusCode(400) nếu có lỗi.
            }
        }

        // Xóa đơn hàng
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            try
            {
                await _orderService.DeleteOrderAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex) when (ex is InvalidOperationException)
            {
                return BadRequest(ex.Message); // Hoặc StatusCode(400) nếu cần.
            }
        }

        // Lấy thông tin đơn hàng theo ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var order = await _orderService.GetOrderByIdAsync(id);

            if (order == null)
                return NotFound();

            return Ok(order);
        }

        // Lấy tất cả các đơn hàng
        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _orderService.GetAllOrdersAsync();
            return Ok(orders);
        }
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetOrdersByUserId(int userId)
        {
            var orders = await _orderService.GetOrdersByUserIdAsync(userId);
            if (orders == null || !orders.Any())
                return NotFound("Không có đơn hàng nào cho người dùng này.");

            return Ok(orders);
        }
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusDTO updateStatusDto)
        {
            try
            {
                var updatedOrder = await _orderService.UpdateStatusOrderAsync(id, updateStatusDto.Status);
                return Ok(updatedOrder);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex) when (ex is InvalidOperationException)
            {
                return BadRequest(ex.Message); // Hoặc StatusCode(400) nếu cần.
            }
        }


    }
}
