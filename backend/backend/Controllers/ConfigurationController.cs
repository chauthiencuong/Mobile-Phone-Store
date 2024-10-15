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
    public class ConfigurationController : ControllerBase
    {
        private readonly DataContext _context;

        public ConfigurationController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ConfigurationDTO>>> GetConfigurations()
        {
            var configurations = await _context.Configurations.ToListAsync();
            var configurationDTOs = configurations.Select(c => new ConfigurationDTO
            {
                Id = c.Id,
                Value = c.Value
            }).ToList();

            return Ok(configurationDTOs);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ConfigurationDTO>> GetConfiguration(int id)
        {
            var configuration = await _context.Configurations.FindAsync(id);

            if (configuration == null)
            {
                return NotFound();
            }

            var configurationDTO = new ConfigurationDTO
            {
                Id = configuration.Id,
                Value = configuration.Value
            };

            return Ok(configurationDTO);
        }

        [HttpPost]
        public async Task<ActionResult<ConfigurationDTO>> CreateConfiguration(ConfigurationDTO configurationDTO)
        {
            // Kiểm tra xem cấu hình đã tồn tại chưa
            var existingConfiguration = await _context.Configurations
                .FirstOrDefaultAsync(c => c.Value == configurationDTO.Value);

            if (existingConfiguration != null)
            {
                // Nếu cấu hình đã tồn tại, trả về thông tin của cấu hình hiện có
                configurationDTO.Id = existingConfiguration.Id;
                return Ok(configurationDTO);
            }

            // Nếu cấu hình chưa tồn tại, thêm mới cấu hình
            var configuration = new Configuration
            {
                Value = configurationDTO.Value
            };

            _context.Configurations.Add(configuration);
            await _context.SaveChangesAsync();

            configurationDTO.Id = configuration.Id;
            return CreatedAtAction(nameof(GetConfiguration), new { id = configuration.Id }, configurationDTO);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateConfiguration(int id, ConfigurationDTO configurationDTO)
        {
            var configuration = await _context.Configurations.FindAsync(id);

            if (configuration == null)
            {
                return NotFound();
            }

            configuration.Value = configurationDTO.Value;

            _context.Entry(configuration).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteConfiguration(int id)
        {
            var configuration = await _context.Configurations.FindAsync(id);

            if (configuration == null)
            {
                return NotFound();
            }

            _context.Configurations.Remove(configuration);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
