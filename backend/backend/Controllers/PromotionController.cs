using backend.DTOs;
using backend.Model;
using backend.Service;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PromotionController : ControllerBase
    {
        private readonly PromotionService _promotionService;

        public PromotionController(PromotionService promotionService)
        {
            _promotionService = promotionService;
        }

        // Tạo một khuyến mãi mới
        [HttpPost]
        public async Task<IActionResult> CreatePromotion([FromBody] PromotionDTO promotionDto)
        {
            if (promotionDto == null)
            {
                return BadRequest("Dữ liệu khuyến mãi không hợp lệ.");
            }

            // Kiểm tra nếu startDate lớn hơn endDate
            if (promotionDto.StartDate > promotionDto.EndDate)
            {
                return BadRequest("Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc.");
            }

            // Đặt trạng thái IsActive dựa trên endDate
            bool isActive = promotionDto.EndDate >= DateTime.Now;

            var promotion = new Promotion
            {
                Name = promotionDto.Name,
                Description = promotionDto.Description,
                Discount = promotionDto.Discount,
                StartDate = promotionDto.StartDate,
                EndDate = promotionDto.EndDate,
                IsActive = isActive
            };

            try
            {
                // Sử dụng PromotionService để thêm khuyến mãi
                await _promotionService.AddPromotionAsync(promotion);
                return CreatedAtAction(nameof(GetPromotionById), new { id = promotion.Id }, promotion);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Đã xảy ra lỗi khi tạo khuyến mãi: {ex.Message}");
            }
        }


        // Lấy tất cả khuyến mãi
        [HttpGet]
        public async Task<IActionResult> GetAllPromotions()
        {
            var promotions = await _promotionService.GetAllPromotionsAsync();
            return Ok(promotions);
        }

        // Lấy thông tin khuyến mãi theo ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPromotionById(int id)
        {
            var promotion = await _promotionService.GetPromotionByIdAsync(id);
            if (promotion == null)
            {
                return NotFound("Khuyến mãi không tồn tại.");
            }
            return Ok(promotion);
        }
        // Xóa khuyến mãi
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePromotion(int id)
        {
            try
            {
                await _promotionService.DeletePromotionAsync(id);
                return NoContent(); // Trả về 204 No Content khi xóa thành công
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message); // Trả về 404 Not Found nếu khuyến mãi không tồn tại
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Đã xảy ra lỗi khi xóa khuyến mãi: {ex.Message}");
            }
        }

        // Cập nhật khuyến mãi
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePromotion(int id, [FromBody] PromotionDTO promotionDto)
        {
            if (promotionDto == null)
            {
                return BadRequest("Dữ liệu khuyến mãi không hợp lệ.");
            }

            // Kiểm tra nếu startDate lớn hơn endDate
            if (promotionDto.StartDate > promotionDto.EndDate)
            {
                return BadRequest("Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc.");
            }

            var promotion = await _promotionService.GetPromotionByIdAsync(id);
            if (promotion == null)
            {
                return NotFound("Khuyến mãi không tồn tại.");
            }

            // Cập nhật thông tin khuyến mãi
            promotion.Name = promotionDto.Name;
            promotion.Description = promotionDto.Description;
            promotion.Discount = promotionDto.Discount;
            promotion.StartDate = promotionDto.StartDate;
            promotion.EndDate = promotionDto.EndDate;

            // Đặt trạng thái IsActive dựa trên endDate
            promotion.IsActive = promotion.EndDate >= DateTime.Now;

            try
            {
                // Sử dụng PromotionService để cập nhật khuyến mãi
                await _promotionService.UpdatePromotionAsync(promotion);
                return NoContent(); // Trả về 204 No Content khi thành công
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Đã xảy ra lỗi khi cập nhật khuyến mãi: {ex.Message}");
            }
        }
    }
}
