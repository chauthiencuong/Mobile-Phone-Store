using backend.Data;
using backend.DTOs;
using backend.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GalleryController : ControllerBase
    {
        private readonly DataContext _dbContext;

        public GalleryController(DataContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GalleryDTO>>> GetGalleries()
        {
            try
            {
                var galleries = await _dbContext.Galleries
                    .Include(g => g.Product)
                    .ToListAsync();

                if (galleries == null || galleries.Count == 0)
                {
                    return NotFound();
                }

                var galleryDTOs = galleries.Select(gallery => new GalleryDTO
                {
                    Id = gallery.Id,
                    ProductId = gallery.ProductId,
                    ImageGallery = $"{Request.Scheme}://{Request.Host}/{gallery.ImageGallery.Replace("\\", "/")}"
                }).ToList();

                return Ok(galleryDTOs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateGallery([FromForm] CreateGalleryDTO createGalleryDTO)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (createGalleryDTO.ImageFiles == null || createGalleryDTO.ImageFiles.Count == 0)
                {
                    return BadRequest("At least one image file is required.");
                }

                var product = await _dbContext.Products.FindAsync(createGalleryDTO.ProductId);
                if (product == null)
                {
                    return NotFound($"Product with ID {createGalleryDTO.ProductId} not found.");
                }

                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "gallery");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                foreach (var imageFile in createGalleryDTO.ImageFiles)
                {
                    var uniqueFileName = Guid.NewGuid().ToString() + "_" + imageFile.FileName;
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await imageFile.CopyToAsync(stream);
                    }

                    var gallery = new Gallery
                    {
                        ImageGallery = Path.Combine("Uploads", "Gallery", uniqueFileName).Replace("\\", "/"), // Đổi dấu gạch chéo ngược thành gạch chéo
                        ProductId = createGalleryDTO.ProductId
                    };

                    _dbContext.Galleries.Add(gallery);
                }

                await _dbContext.SaveChangesAsync();

                return Ok("Gallery created successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{productId}")]
        public async Task<ActionResult<IEnumerable<GalleryDTO>>> GetGalleriesByProductId(int productId)
        {
            try
            {
                var galleries = await _dbContext.Galleries
                    .Include(g => g.Product)
                    .Where(g => g.ProductId == productId)
                    .ToListAsync();

                if (galleries == null || galleries.Count == 0)
                {
                    return NotFound();
                }

                var galleryDTOs = galleries.Select(gallery => new GalleryDTO
                {
                    Id = gallery.Id,
                    ProductId = gallery.ProductId,
                    ImageGallery = $"{Request.Scheme}://{Request.Host}/{gallery.ImageGallery.Replace("\\", "/")}"
                }).ToList();

                return Ok(galleryDTOs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpPut("{productId}")]
        public async Task<IActionResult> UpdateGallery(int productId, [FromForm] UpdateGalleryDTO updateGalleryDTO)
        {
            try
            {
                // Tìm sản phẩm dựa trên productId
                var product = await _dbContext.Products.FindAsync(productId);
                if (product == null)
                {
                    return NotFound($"Product with ID {productId} not found.");
                }

                // Tìm tất cả các hình ảnh hiện tại của sản phẩm
                var existingGalleries = await _dbContext.Galleries
                    .Where(g => g.ProductId == productId)
                    .ToListAsync();

                // Xóa hình ảnh cũ (tuỳ chọn)
                foreach (var gallery in existingGalleries)
                {
                    var imagePath = Path.Combine(Directory.GetCurrentDirectory(), gallery.ImageGallery.Replace("/", "\\"));
                    if (System.IO.File.Exists(imagePath))
                    {
                        System.IO.File.Delete(imagePath);
                    }
                    _dbContext.Galleries.Remove(gallery);
                }

                // Lưu các hình ảnh mới
                if (updateGalleryDTO.ImageFiles != null && updateGalleryDTO.ImageFiles.Count > 0)
                {
                    var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "gallery");
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    foreach (var imageFile in updateGalleryDTO.ImageFiles)
                    {
                        var uniqueFileName = Guid.NewGuid().ToString() + "_" + imageFile.FileName;
                        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await imageFile.CopyToAsync(stream);
                        }

                        var gallery = new Gallery
                        {
                            ImageGallery = Path.Combine("Uploads", "Gallery", uniqueFileName).Replace("\\", "/"),
                            ProductId = productId
                        };

                        _dbContext.Galleries.Add(gallery);
                    }

                    await _dbContext.SaveChangesAsync();
                }

                return Ok("Gallery updated successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpDelete("{galleryId}")]
        public async Task<IActionResult> DeleteGallery(int galleryId)
        {
            try
            {
                var gallery = await _dbContext.Galleries.FindAsync(galleryId);

                if (gallery == null)
                {
                    return NotFound();
                }

                var imagePath = Path.Combine(Directory.GetCurrentDirectory(), gallery.ImageGallery.Replace("/", "\\"));
                if (System.IO.File.Exists(imagePath))
                {
                    System.IO.File.Delete(imagePath);
                }

                _dbContext.Galleries.Remove(gallery);
                await _dbContext.SaveChangesAsync();

                return Ok("Delete success");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
