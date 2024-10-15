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
    public class PostController : ControllerBase
    {
        private readonly DataContext _context;

        public PostController(DataContext context)
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
        public async Task<ActionResult<IEnumerable<Post>>> GetPosts()
        {
            var posts = await _context.Posts.ToListAsync();

            // Tạo đường dẫn hoàn chỉnh đến ảnh bằng cách kết hợp RequestPath và tên ảnh
            posts.ForEach(b => b.ImagePost = $"{Request.Scheme}://{Request.Host}/{b.ImagePost.Replace("\\", "/")}");

            return posts;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Post>> GetPost(int id)
        {
            var post = await _context.Posts.FindAsync(id);

            if (post == null)
            {
                return NotFound();
            }

            post.ImagePost = $"{Request.Scheme}://{Request.Host}/{post.ImagePost.Replace("\\", "/")}";

            return post;
        }

        [HttpPost]
        public async Task<IActionResult> CreatePost([FromForm] CreatePostDTO postDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (postDto.ImageFile == null || postDto.ImageFile.Length == 0)
                {
                    return BadRequest("Image file is required.");
                }

                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "Post");

                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var uniqueFileName = Guid.NewGuid().ToString() + "_" + postDto.ImageFile.FileName;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await postDto.ImageFile.CopyToAsync(stream);
                }

                var post = new Post
                {
                    Name = postDto.Name,
                    Slug = GenerateSlug(postDto.Name),
                    Description1 = postDto.Description1,
                    Description2 = postDto.Description2,
                    Description3 = postDto.Description3,
                    Description4 = postDto.Description4,
                    Status = postDto.Status,
                    ImagePost = Path.Combine("Uploads", "Post", uniqueFileName),
                    CreatedBy = 1,
                    UpdatedBy = 1,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                };

                _context.Posts.Add(post);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetPost), new { id = post.Id }, post);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutPost(int id, [FromForm] CreatePostDTO postDto)
        {
            var post = await _context.Posts.FindAsync(id);

            if (post == null)
            {
                return NotFound();
            }

            if (postDto.ImageFile != null && postDto.ImageFile.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "Post");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var uniqueFileName = Guid.NewGuid().ToString() + "_" + postDto.ImageFile.FileName;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await postDto.ImageFile.CopyToAsync(fileStream);
                }

                if (!string.IsNullOrEmpty(post.ImagePost))
                {
                    var oldImagePath = Path.Combine(Directory.GetCurrentDirectory(), post.ImagePost.TrimStart('/'));
                    if (System.IO.File.Exists(oldImagePath))
                    {
                        System.IO.File.Delete(oldImagePath);
                    }
                }

                post.ImagePost = Path.Combine("Uploads", "Post", uniqueFileName);
            }

            post.Name = postDto.Name;
            post.Slug = GenerateSlug(postDto.Name);
            post.Description1 = postDto.Description1;
            post.Description2 = postDto.Description2;
            post.Description3 = postDto.Description3;
            post.Description4 = postDto.Description4;
            post.Status = postDto.Status;
            post.UpdatedAt = DateTime.UtcNow;

            _context.Entry(post).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBanner(int id)
        {
            var post = await _context.Posts.FindAsync(id);

            if (post == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrEmpty(post.ImagePost))
            {
                var imagePath = Path.Combine(Directory.GetCurrentDirectory(), post.ImagePost.TrimStart('/'));
                if (System.IO.File.Exists(imagePath))
                {
                    System.IO.File.Delete(imagePath);
                }
            }

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();

            return Ok("Delete success");
        }
    }
}
