using backend.Data;
using backend.DTOs;
using backend.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductVariantController : ControllerBase
    {
        private readonly DataContext _context;

        public ProductVariantController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductVariantDTO>>> GetProductVariants()
        {
            var productVariants = await _context.ProductVariants
                .Include(pv => pv.Color)
                .Include(pv => pv.Configuration)
                .ToListAsync();

            var productVariantDTOs = productVariants.Select(pv => new ProductVariantDTO
            {
                Id = pv.Id,
                ProductId = pv.ProductId,
                ColorId = pv.ColorId,
                Color = pv.Color != null ? new ColorDTO
                {
                    Id = pv.Color.Id,
                    Value = pv.Color.Value
                } : null,
                ConfigurationId = pv.ConfigurationId,
                Configuration = pv.Configuration != null ? new ConfigurationDTO
                {
                    Id = pv.Configuration.Id,
                    Value = pv.Configuration.Value
                } : null,
                Price = pv.Price,
                Qty = pv.Qty
            }).ToList();

            return Ok(productVariantDTOs);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductVariantDTO>> GetProductVariant(int id)
        {
            var productVariant = await _context.ProductVariants
                .Include(pv => pv.Color)
                .Include(pv => pv.Configuration)
                .FirstOrDefaultAsync(pv => pv.ProductId == id);

            if (productVariant == null)
            {
                return NotFound();
            }

            var productVariantDTO = new ProductVariantDTO
            {
                Id = productVariant.Id,
                ProductId = productVariant.ProductId,
                ColorId = productVariant.ColorId,
                Color = productVariant.Color != null ? new ColorDTO
                {
                    Id = productVariant.Color.Id,
                    Value = productVariant.Color.Value
                } : null,
                ConfigurationId = productVariant.ConfigurationId,
                Configuration = productVariant.Configuration != null ? new ConfigurationDTO
                {
                    Id = productVariant.Configuration.Id,
                    Value = productVariant.Configuration.Value
                } : null,
                Price = productVariant.Price,
                Qty = productVariant.Qty
            };

            return Ok(productVariantDTO);
        }

        [HttpPost]
        public async Task<ActionResult<ProductVariantDTO>> CreateProductVariant(CreateProductVariantDTO createProductVariantDTO)
        {
            // Xử lý giá trị của ColorId và ConfigurationId để đảm bảo chúng hợp lệ
            int? colorId = createProductVariantDTO.ColorId > 0 ? createProductVariantDTO.ColorId : (int?)null;
            int? configurationId = createProductVariantDTO.ConfigurationId > 0 ? createProductVariantDTO.ConfigurationId : (int?)null;

            var productVariant = new ProductVariant
            {
                ProductId = createProductVariantDTO.ProductId,
                ColorId = colorId,
                ConfigurationId = configurationId,
                Price = createProductVariantDTO.Price,
                Qty = createProductVariantDTO.Qty
            };

            try
            {
                _context.ProductVariants.Add(productVariant);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                // Xử lý lỗi khi lưu dữ liệu vào cơ sở dữ liệu
                return BadRequest(new { Message = "Có lỗi xảy ra khi lưu biến thể sản phẩm.", Details = ex.Message });
            }

            var productVariantDTO = new ProductVariantDTO
            {
                Id = productVariant.Id,
                ProductId = productVariant.ProductId,
                ColorId = productVariant.ColorId,
                ConfigurationId = productVariant.ConfigurationId,
                Price = productVariant.Price,
                Qty = productVariant.Qty
            };

            return CreatedAtAction(nameof(GetProductVariant), new { id = productVariantDTO.Id }, productVariantDTO);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProductVariant(int id, UpdateProductVariantDTO productVariantDTO)
        {
            var productVariant = await _context.ProductVariants
                .FindAsync(id);

            if (productVariant == null)
            {
                return NotFound();
            }

            productVariant.ColorId = productVariantDTO.ColorId;
            productVariant.ConfigurationId = productVariantDTO.ConfigurationId;
            productVariant.Price = productVariantDTO.Price;
            productVariant.Qty = productVariantDTO.Qty;

            _context.Entry(productVariant).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductVariant(int id)
        {
            var productVariant = await _context.ProductVariants
                .FindAsync(id);

            if (productVariant == null)
            {
                return NotFound();
            }

            _context.ProductVariants.Remove(productVariant);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpGet("Product/{productId}")]
        public async Task<ActionResult<IEnumerable<ProductVariantDTO>>> GetProductVariantsByProductId(int productId)
        {
            try
            {
                // Lấy tất cả các biến thể sản phẩm cho productId cụ thể
                var productVariants = await _context.ProductVariants
                    .Include(pv => pv.Color)
                    .Include(pv => pv.Configuration)
                    .Where(pv => pv.ProductId == productId)
                    .ToListAsync();

                // Kiểm tra nếu không có dữ liệu
                if (productVariants == null || !productVariants.Any())
                {
                    return NotFound();
                }

                // Chuyển đổi thành DTO
                var productVariantDTOs = productVariants.Select(pv => new ProductVariantDTO
                {
                    Id = pv.Id,
                    ProductId = pv.ProductId,
                    ColorId = pv.ColorId,
                    Color = pv.Color != null ? new ColorDTO
                    {
                        Id = pv.Color.Id,
                        Value = pv.Color.Value
                    } : null,
                    ConfigurationId = pv.ConfigurationId,
                    Configuration = pv.Configuration != null ? new ConfigurationDTO
                    {
                        Id = pv.Configuration.Id,
                        Value = pv.Configuration.Value
                    } : null,
                    Price = pv.Price,
                    Qty = pv.Qty
                }).ToList();

                return Ok(productVariantDTOs);
            }
            catch (Exception ex)
            {
                // Xử lý lỗi và trả về mã lỗi 500
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}
