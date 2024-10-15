using backend.Data;
using backend.DTOs;
using backend.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Unidecode.NET; // Thêm thư viện Unidecode.NET

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BrandController : ControllerBase
    {
        private readonly DataContext _context;

        public BrandController(DataContext context)
        {
            _context = context;
        }

        private string GenerateSlug(string name)
        {
            string slug = name.Unidecode().ToLowerInvariant();
            slug = Regex.Replace(slug, @"[^a-z0-9\s-]", "");
            slug = Regex.Replace(slug, @"\s+", "-").Trim('-');
            return slug;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Brand>>> GetBrands()
        {
            var brands = await _context.Brands.ToListAsync();

            // Tạo đường dẫn hoàn chỉnh đến ảnh bằng cách kết hợp RequestPath và tên ảnh
            brands.ForEach(b => b.ImageBrand = $"{Request.Scheme}://{Request.Host}/{b.ImageBrand.Replace("\\", "/")}");

            return brands;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Brand>> GetBrand(int id)
        {
            var brand = await _context.Brands.FindAsync(id);

            if (brand == null)
            {
                return NotFound();
            }

            brand.ImageBrand = $"{Request.Scheme}://{Request.Host}/{brand.ImageBrand.Replace("\\", "/")}";

            return brand;
        }

        [HttpPost]
        public async Task<IActionResult> CreateBrand([FromForm] CreateBrandDTO brandDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (brandDto.ImageFile == null || brandDto.ImageFile.Length == 0)
                {
                    return BadRequest("Image file is required.");
                }

                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "Brand");

                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var uniqueFileName = Guid.NewGuid().ToString() + "_" + brandDto.ImageFile.FileName;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await brandDto.ImageFile.CopyToAsync(stream);
                }

                var brand = new Brand
                {
                    Name = brandDto.Name,
                    Slug = GenerateSlug(brandDto.Name),
                    Description = brandDto.Description,
                    Status = brandDto.Status,
                    ImageBrand = Path.Combine("Uploads", "Brand", uniqueFileName), // Lưu đường dẫn đến tệp ảnh trong cơ sở dữ liệu
                    CreatedBy = 1,
                    UpdatedBy = 1,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                };

                _context.Brands.Add(brand);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetBrand), new { id = brand.Id }, brand);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutBrand(int id, [FromForm] CreateBrandDTO brandDto)
        {
            var brand = await _context.Brands.FindAsync(id);

            if (brand == null)
            {
                return NotFound();
            }

            if (brandDto.ImageFile != null && brandDto.ImageFile.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "Brand");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var uniqueFileName = Guid.NewGuid().ToString() + "_" + brandDto.ImageFile.FileName;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await brandDto.ImageFile.CopyToAsync(fileStream);
                }

                if (!string.IsNullOrEmpty(brand.ImageBrand))
                {
                    var oldImagePath = Path.Combine(Directory.GetCurrentDirectory(), brand.ImageBrand.TrimStart('/'));
                    if (System.IO.File.Exists(oldImagePath))
                    {
                        System.IO.File.Delete(oldImagePath);
                    }
                }

                brand.ImageBrand = Path.Combine("Uploads", "Brand", uniqueFileName);
            }

            brand.Name = brandDto.Name;
            brand.Slug = GenerateSlug(brandDto.Name);
            brand.Description = brandDto.Description;
            brand.Status = brandDto.Status;
            brand.UpdatedAt = DateTime.UtcNow;

            _context.Entry(brand).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBrand(int id)
        {
            // Tìm thương hiệu theo ID và bao gồm các sản phẩm liên quan
            var brand = await _context.Brands
                .Include(b => b.Products) // Bao gồm các sản phẩm liên quan
                .FirstOrDefaultAsync(b => b.Id == id);

            if (brand == null)
            {
                return NotFound();
            }

            // Xóa các sản phẩm liên quan trước
            if (brand.Products.Any())
            {
                _context.Products.RemoveRange(brand.Products);
            }

            // Xóa ảnh nếu có
            if (!string.IsNullOrEmpty(brand.ImageBrand))
            {
                var imagePath = Path.Combine(Directory.GetCurrentDirectory(), brand.ImageBrand.TrimStart('/'));
                if (System.IO.File.Exists(imagePath))
                {
                    System.IO.File.Delete(imagePath);
                }
            }

            // Xóa thương hiệu
            _context.Brands.Remove(brand);
            await _context.SaveChangesAsync();

            return Ok("Delete success");
        }

    }
}
