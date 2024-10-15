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
    public class ColorController : ControllerBase
    {
        private readonly DataContext _context;

        public ColorController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ColorDTO>>> GetColors()
        {
            var colors = await _context.Colors.ToListAsync();
            var colorDTOs = colors.Select(c => new ColorDTO
            {
                Id = c.Id,
                Value = c.Value
            }).ToList();

            return Ok(colorDTOs);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ColorDTO>> GetColor(int id)
        {
            var color = await _context.Colors.FindAsync(id);

            if (color == null)
            {
                return NotFound();
            }

            var colorDTO = new ColorDTO
            {
                Id = color.Id,
                Value = color.Value
            };

            return Ok(colorDTO);
        }

        [HttpPost]
        public async Task<ActionResult<ColorDTO>> CreateColor(ColorDTO colorDTO)
        {
            // Kiểm tra xem màu sắc đã tồn tại chưa
            var existingColor = await _context.Colors
                .FirstOrDefaultAsync(c => c.Value == colorDTO.Value);

            if (existingColor != null)
            {
                // Nếu màu sắc đã tồn tại, trả về thông tin của màu sắc hiện có
                colorDTO.Id = existingColor.Id;
                return Ok(colorDTO);
            }

            // Nếu màu sắc chưa tồn tại, thêm mới màu sắc
            var color = new Color
            {
                Value = colorDTO.Value
            };

            _context.Colors.Add(color);
            await _context.SaveChangesAsync();

            colorDTO.Id = color.Id;
            return CreatedAtAction(nameof(GetColor), new { id = color.Id }, colorDTO);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateColor(int id, ColorDTO colorDTO)
        {
            var color = await _context.Colors.FindAsync(id);

            if (color == null)
            {
                return NotFound();
            }

            color.Value = colorDTO.Value;

            _context.Entry(color).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteColor(int id)
        {
            var color = await _context.Colors.FindAsync(id);

            if (color == null)
            {
                return NotFound();
            }

            _context.Colors.Remove(color);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
