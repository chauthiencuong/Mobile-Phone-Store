using backend.Data;
using backend.Model;
using backend.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Unidecode.NET;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenuController : ControllerBase
    {
        private readonly DataContext _context;

        public MenuController(DataContext context)
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

        // Lấy tất cả các menu
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Menu>>> GetMenus()
        {
            var menus = await _context.Menus.ToListAsync();
            return menus;
        }

        // Lấy một menu theo id
        [HttpGet("{id}")]
        public async Task<ActionResult<Menu>> GetMenu(int id)
        {
            var menu = await _context.Menus.FindAsync(id);

            if (menu == null)
            {
                return NotFound();
            }
            return menu;
        }

        // Tạo mới một menu
        [HttpPost]
        public async Task<IActionResult> CreateMenu([FromBody] CreateMenuDTO createMenuDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var menu = new Menu
            {
                Name = createMenuDTO.Name,
                Slug = GenerateSlug(createMenuDTO.Name),
                Link = createMenuDTO.Link,
                Status = createMenuDTO.Status,
                CreatedBy = 1, // Thay thế bằng thông tin người dùng thực
                UpdatedBy = 1, // Thay thế bằng thông tin người dùng thực
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
            };

            _context.Menus.Add(menu);
            await _context.SaveChangesAsync();

            var menuDTO = new MenuDTO
            {
                Id = menu.Id,
                Name = menu.Name,
                Link = menu.Link,
                Status = menu.Status
            };

            return CreatedAtAction(nameof(GetMenu), new { id = menu.Id }, menuDTO);
        }

        // Cập nhật một menu theo id
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMenu(int id, [FromBody] CreateMenuDTO updateMenuDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var menu = await _context.Menus.FindAsync(id);

            if (menu == null)
            {
                return NotFound();
            }

            menu.Name = updateMenuDTO.Name;
            menu.Slug = GenerateSlug(updateMenuDTO.Name);
            menu.Link = updateMenuDTO.Link;
            menu.Status = updateMenuDTO.Status;
            menu.UpdatedAt = DateTime.Now;
            menu.UpdatedBy = 1;

            _context.Entry(menu).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Xóa một menu theo id
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMenu(int id)
        {
            var menu = await _context.Menus.FindAsync(id);

            if (menu == null)
            {
                return NotFound();
            }

            _context.Menus.Remove(menu);
            await _context.SaveChangesAsync();

            return Ok("Delete success");
        }
    }
}
