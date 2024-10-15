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
using Unidecode.NET;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly DataContext _context;

        public CategoryController(DataContext context)
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
        public async Task<ActionResult<IEnumerable<CategoryDTO>>> GetCategories()
        {
            var categories = await _context.Categories.ToListAsync();

            var categoryDtos = categories.Select(c => new CategoryDTO
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                ImageCategory = $"{Request.Scheme}://{Request.Host}/{c.ImageCategory?.Replace("\\", "/")}",
                Parent_id = c.Parent_id,
                Status = c.Status
            }).ToList();

            return Ok(categoryDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
            {
                return NotFound();
            }

            if (category.ImageCategory != null)
            {
                category.ImageCategory = $"{Request.Scheme}://{Request.Host}/{category.ImageCategory.Replace("\\", "/")}";
            }

            return category;
        }


        [HttpPost]
        public async Task<IActionResult> CreateCategory([FromForm] CreateCategoryDTO categoryDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var category = new Category
                {   
                    Name = categoryDto.Name,
                    Slug = GenerateSlug(categoryDto.Name),
                    Description = categoryDto.Description,
                    Parent_id = categoryDto.Parent_id,
                    Status = categoryDto.Status,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                    CreatedBy = 1,
                    UpdatedBy = 1
                };

                if (categoryDto.ImageFile != null && categoryDto.ImageFile.Length > 0)
                {
                    var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "Category");

                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    var uniqueFileName = Guid.NewGuid().ToString() + "_" + categoryDto.ImageFile.FileName;
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await categoryDto.ImageFile.CopyToAsync(stream);
                    }

                    category.ImageCategory = Path.Combine("Uploads", "Category", uniqueFileName);
                }

                _context.Categories.Add(category);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, category);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategory(int id, [FromForm] CreateCategoryDTO categoryDto)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
            {
                return NotFound();
            }

            if (categoryDto.ImageFile != null && categoryDto.ImageFile.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "Category");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var uniqueFileName = Guid.NewGuid().ToString() + "_" + categoryDto.ImageFile.FileName;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await categoryDto.ImageFile.CopyToAsync(fileStream);
                }

                if (!string.IsNullOrEmpty(category.ImageCategory))
                {
                    var oldImagePath = Path.Combine(Directory.GetCurrentDirectory(), category.ImageCategory.TrimStart('/'));
                    if (System.IO.File.Exists(oldImagePath))
                    {
                        System.IO.File.Delete(oldImagePath);
                    }
                }

                category.ImageCategory = Path.Combine("Uploads", "Category", uniqueFileName);
            }

            category.Name = categoryDto.Name;
            category.Slug = GenerateSlug(categoryDto.Name);
            category.Description = categoryDto.Description;
            category.Parent_id = categoryDto.Parent_id;
            category.Status = categoryDto.Status;
            category.UpdatedAt = DateTime.UtcNow;

            _context.Entry(category).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories
                .Include(c => c.Products) // Bao gồm các sản phẩm liên quan
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
            {
                return NotFound();
            }

            // Xóa các sản phẩm liên quan trước
            if (category.Products.Any())
            {
                _context.Products.RemoveRange(category.Products);
            }

            // Xóa ảnh nếu có
            if (!string.IsNullOrEmpty(category.ImageCategory))
            {
                var imagePath = Path.Combine(Directory.GetCurrentDirectory(), category.ImageCategory.TrimStart('/'));
                if (System.IO.File.Exists(imagePath))
                {
                    System.IO.File.Delete(imagePath);
                }
            }

            // Xóa category
            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return Ok("Delete success");
        }
    }
}
