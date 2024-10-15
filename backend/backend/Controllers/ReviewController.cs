using backend.Data;
using backend.DTOs;
using backend.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend_Ecommerce.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {

        private readonly DataContext _dbContext;

        public ReviewController(DataContext dbContext)
        {
            _dbContext = dbContext;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReViewDTO>>> GetReviews()
        {
            try
            {
                var reviews = await _dbContext.Reviews
               .Include(g => g.Product)
               .Include(g => g.User)
               .ToListAsync();
                if (reviews == null)
                {
                    return NotFound();
                }

                var reviewDTOs = reviews.Select(review => new ReViewDTO
                {
                    Id = review.Id,
                    ProductId = review.ProductId,
                    UserId = review.UserId,
                    Rating = review.Rating,
                    Comment = review.Comment,
                    CreatedAt = review.CreatedAt,
                    UpdatedAt = review.UpdatedAt,
                    Product = new ProductDTO
                    {

                        Id = review.Product.Id,
                        Name = review.Product.Name,
                    },
                    User = new UserDTO
                    {

                        Id = review.User.Id,
                        Name = review.User.Name,
                        ImageUser = review.User.ImageUser,
                    }
                }).ToList();

                return reviewDTOs;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpPost]
        public async Task<ActionResult<ReViewDTO>> AddReview(AddReViewDTO reviewDTO)
        {
            try
            {
                // Kiểm tra xem sản phẩm và người dùng có tồn tại không
                var product = await _dbContext.Products.FindAsync(reviewDTO.ProductId);
                var user = await _dbContext.Users.FindAsync(reviewDTO.UserId);

                if (product == null || user == null)
                {
                    return NotFound("Product or user not found");
                }

                // Tạo một đối tượng Review từ dữ liệu DTO
                var review = new Review
                {
                    ProductId = reviewDTO.ProductId,
                    UserId = reviewDTO.UserId,
                    Comment = reviewDTO.Comment,
                    Rating = reviewDTO.Rating,
                    CreatedAt = DateTime.Now, 
                    UpdatedAt = null
                };

                // Thêm đánh giá vào cơ sở dữ liệu
                _dbContext.Reviews.Add(review);
                await _dbContext.SaveChangesAsync();

                // Tạo một đối tượng ReViewDTO để trả về
                var reviewDto = new ReViewDTO
                {
                    Id = review.Id,
                    ProductId = review.ProductId,
                    UserId = review.UserId,
                    Comment = review.Comment,
                    Rating = review.Rating,
                    CreatedAt = review.CreatedAt,
                    UpdatedAt = review.UpdatedAt,
                    Product = new ProductDTO
                    {
                        Id = product.Id,
                        Name = product.Name
                    },
                    User = new UserDTO
                    {
                        Id = user.Id,
                        Name = user.Name,
                    }
                };

                return CreatedAtAction(nameof(GetReviews), new { id = review.Id }, reviewDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpGet("{productId}")]
        public async Task<ActionResult<IEnumerable<ReViewDTO>>> GetReviewsByProductId(int productId)
        {
            try
            {
                var reviews = await _dbContext.Reviews
                    .Where(r => r.ProductId == productId)
                    .Include(r => r.Product)
                    .Include(r => r.User)
                    .ToListAsync();

                if (reviews == null || reviews.Count == 0)
                {
                    return NotFound("No reviews found for the specified product.");
                }

                var reviewDTOs = reviews.Select(review => new ReViewDTO
                {
                    Id = review.Id,
                    ProductId = review.ProductId,
                    UserId = review.UserId,
                    Rating = review.Rating,
                    Comment = review.Comment,
                    CreatedAt = review.CreatedAt,
                    UpdatedAt = review.UpdatedAt,
                    Product = new ProductDTO
                    {
                        Id = review.Product.Id,
                        Name = review.Product.Name,
                    },
                    User = new UserDTO
                    {
                        Id = review.User.Id,
                        Name = review.User.Name,
                    }
                }).ToList();

                return reviewDTOs;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
