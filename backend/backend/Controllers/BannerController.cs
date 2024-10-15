using backend.Data;
using backend.Model;
using Microsoft.AspNetCore.Http.HttpResults;
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
    public class BannerController : ControllerBase
    {
        private readonly DataContext _context;

        public BannerController(DataContext context)
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
        public async Task<ActionResult<IEnumerable<Banner>>> GetBanners()
        {
            var banners = await _context.Banners.ToListAsync();

            // Tạo đường dẫn hoàn chỉnh đến ảnh bằng cách kết hợp RequestPath và tên ảnh
            banners.ForEach(b => b.ImageBanner = $"{Request.Scheme}://{Request.Host}/{b.ImageBanner.Replace("\\", "/")}");

            return banners;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Banner>> GetBanner(int id)
        {
            var banner = await _context.Banners.FindAsync(id);

            if (banner == null)
            {
                return NotFound();
            }

            banner.ImageBanner = $"{Request.Scheme}://{Request.Host}/{banner.ImageBanner.Replace("\\", "/")}";

            return banner;
        }

        [HttpPost]
        public async Task<IActionResult> CreateBanner([FromForm] BannerDTO bannerDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (bannerDto.ImageFile == null || bannerDto.ImageFile.Length == 0)
                {
                    return BadRequest("Image file is required.");
                }

                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "Banner");

                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var uniqueFileName = Guid.NewGuid().ToString() + "_" + bannerDto.ImageFile.FileName;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await bannerDto.ImageFile.CopyToAsync(stream);
                }

                var banner = new Banner
                {
                    Name = bannerDto.Name,
                    Slug = GenerateSlug(bannerDto.Name),
                    Description = bannerDto.Description,
                    Status = bannerDto.Status,
                    ImageBanner = Path.Combine("Uploads", "Banner", uniqueFileName), // Lưu đường dẫn đến tệp ảnh trong cơ sở dữ liệu
                    CreatedBy = 1,
                    UpdatedBy = 1,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                };

                _context.Banners.Add(banner);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetBanner), new { id = banner.Id }, banner);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutBanner(int id, [FromForm] BannerDTO bannerDto)
        {
            var banner = await _context.Banners.FindAsync(id);

            if (banner == null)
            {
                return NotFound();
            }

            if (bannerDto.ImageFile != null && bannerDto.ImageFile.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "Banner");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var uniqueFileName = Guid.NewGuid().ToString() + "_" + bannerDto.ImageFile.FileName;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await bannerDto.ImageFile.CopyToAsync(fileStream);
                }

                if (!string.IsNullOrEmpty(banner.ImageBanner))
                {
                    var oldImagePath = Path.Combine(Directory.GetCurrentDirectory(), banner.ImageBanner.TrimStart('/'));
                    if (System.IO.File.Exists(oldImagePath))
                    {
                        System.IO.File.Delete(oldImagePath);
                    }
                }

                banner.ImageBanner = Path.Combine("Uploads", "Banner", uniqueFileName);
            }

            banner.Name = bannerDto.Name;
            banner.Slug = GenerateSlug(bannerDto.Name);
            banner.Description = bannerDto.Description;
            banner.Status = bannerDto.Status;
            banner.UpdatedAt = DateTime.UtcNow;

            _context.Entry(banner).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBanner(int id)
        {
            var banner = await _context.Banners.FindAsync(id);

            if (banner == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrEmpty(banner.ImageBanner))
            {
                var imagePath = Path.Combine(Directory.GetCurrentDirectory(), banner.ImageBanner.TrimStart('/'));
                if (System.IO.File.Exists(imagePath))
                {
                    System.IO.File.Delete(imagePath);
                }
            }

            _context.Banners.Remove(banner);
            await _context.SaveChangesAsync();

            return Ok("Delete success");
        }
    }
}
