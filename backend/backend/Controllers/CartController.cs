using backend.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly CartService _cartService;

        public CartController(CartService cartService)
        {
            _cartService = cartService;
        }

        // Lấy giỏ hàng của người dùng
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetCart(int userId)
        {
            try
            {
                var cart = await _cartService.GetCartByUserIdAsync(userId);

                if (cart == null)
                    return NotFound("Giỏ hàng không tồn tại.");

                return Ok(cart);
            }
            catch (Exception ex)
            {
                // Xử lý lỗi chung (nếu cần)
                return StatusCode(500, ex.Message);
            }
        }

        // DTO để thêm sản phẩm vào giỏ hàng
        public class AddToCartDto
        {
            public int UserId { get; set; }
            public int ProductVariantId { get; set; }
            public int Quantity { get; set; }
        }

        // Thêm sản phẩm vào giỏ hàng
        [HttpPost("add")]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartDto dto)
        {
            try
            {
                await _cartService.AddToCartAsync(dto.UserId, dto.ProductVariantId, dto.Quantity);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message); // Trả về lỗi 400 với thông báo lỗi
            }
            catch (Exception ex)
            {
                // Xử lý lỗi chung (nếu cần)
                return StatusCode(500, ex.Message);
            }
        }
        public class UpdateCartItemRequest
        {
            public int UserId { get; set; }
            public int ProductVariantId { get; set; }
            public int NewQuantity { get; set; }
        }
        [HttpPut("update")]
        public async Task<IActionResult> UpdateCartItemAsync([FromBody] UpdateCartItemRequest request)
        {
            if (request == null)
                return BadRequest("Invalid request data.");

            try
            {
                await _cartService.UpdateCartItemAsync(request.UserId, request.ProductVariantId, request.NewQuantity);
                return Ok("Cart item updated successfully.");
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error.");
            }
        }

        // Xóa sản phẩm khỏi giỏ hàng
        [HttpDelete("remove")]
        public async Task<IActionResult> RemoveFromCart(int userId, int productVariantId)
        {
            try
            {
                await _cartService.RemoveFromCartAsync(userId, productVariantId);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                // Xử lý lỗi chung (nếu cần)
                return StatusCode(500, ex.Message);
            }
        }

        // Xóa toàn bộ giỏ hàng của người dùng
        [HttpDelete("clear/{userId}")]
        public async Task<IActionResult> ClearCart(int userId)
        {
            try
            {
                await _cartService.ClearCartAsync(userId);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                // Xử lý lỗi chung (nếu cần)
                return StatusCode(500, ex.Message);
            }
        }
    }
}
