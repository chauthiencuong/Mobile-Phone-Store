using backend.DTOs;
using backend.Service;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductPromotionController : ControllerBase
    {
        private readonly PromotionService _promotionService;

        public ProductPromotionController(PromotionService promotionService)
        {
            _promotionService = promotionService;
        }

        // Áp dụng khuyến mãi cho sản phẩm
        [HttpPost("apply")]
        public async Task<IActionResult> ApplyPromotion([FromBody] CreateProductPromotionDTO createProductPromotionDto)
        {
            if (createProductPromotionDto == null)
            {
                return BadRequest("Dữ liệu khuyến mãi sản phẩm không hợp lệ.");
            }

            try
            {
                await _promotionService.ApplyPromotionAsync(createProductPromotionDto.ProductVariantId, createProductPromotionDto.PromotionId);
                return Ok("Khuyến mãi đã được áp dụng cho sản phẩm.");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Đã xảy ra lỗi khi áp dụng khuyến mãi: {ex.Message}");
            }
        }
        // Lấy danh sách khuyến mãi của sản phẩm
        [HttpGet("Product/{productId}")]
        public async Task<IActionResult> GetPromotionsByProductId(int productId)
        {
            if (productId <= 0)
            {
                return BadRequest("ID sản phẩm không hợp lệ.");
            }

            try
            {
                var promotions = await _promotionService.GetPromotionsByProductIdAsync(productId);
                return Ok(promotions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Đã xảy ra lỗi khi lấy khuyến mãi: {ex.Message}");
            }
        }
        [HttpGet]
        public async Task<IActionResult> GetAllProductPromotions()
        {
            try
            {
                var productPromotions = await _promotionService.GetAllProductPromotionsAsync();
                return Ok(productPromotions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Đã xảy ra lỗi khi lấy danh sách khuyến mãi sản phẩm: {ex.Message}");
            }
        }
    }
}
