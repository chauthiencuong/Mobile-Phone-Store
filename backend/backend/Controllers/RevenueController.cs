using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RevenueController : ControllerBase
    {
        private readonly IRevenueService _revenueService;

        public RevenueController(IRevenueService revenueService)
        {
            _revenueService = revenueService;
        }

        // Lấy doanh thu của ngày hôm nay
        [HttpGet("by-date")]
        public async Task<IActionResult> GetRevenueByDate()
        {
            var revenue = await _revenueService.GetRevenueForTodayAsync();
            return Ok(revenue);
        }

        // Lấy doanh thu của tháng hiện tại
        [HttpGet("by-month")]
        public async Task<IActionResult> GetRevenueByMonth()
        {
            var revenue = await _revenueService.GetRevenueByMonthAsync();
            return Ok(revenue);
        }

        // Lấy doanh thu của năm hiện tại
        [HttpGet("by-year")]
        public async Task<IActionResult> GetRevenueByYear()
        {
            var revenue = await _revenueService.GetRevenueByYearAsync();
            return Ok(revenue);
        }

        // Lấy doanh thu theo từng ngày trong tháng hiện tại
        [HttpGet("by-each-day-in-month")]
        public async Task<IActionResult> GetRevenueForEachDayInMonth()
        {
            var revenue = await _revenueService.GetRevenueForEachDayInMonthAsync();
            return Ok(revenue);
        }
    }
}
