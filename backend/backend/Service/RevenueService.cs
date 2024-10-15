using backend.DTOs;
using backend.Data;
using backend.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Services
{
    public class RevenueService : IRevenueService
    {
        private readonly DataContext _context;

        public RevenueService(DataContext context)
        {
            _context = context;
        }

        public async Task<List<RevenueByDateDTO>> GetRevenueForTodayAsync()
        {
            var today = DateTime.Today;

            return await _context.Orders
                .Where(o => o.CreatedAt.HasValue && o.CreatedAt.Value.Date == today)
                .GroupBy(o => o.CreatedAt.Value.Date)
                .Select(g => new RevenueByDateDTO
                {
                    Date = g.Key,
                    TotalRevenue = g.Sum(o => o.TotalPrice)
                })
                .ToListAsync();
        }

        public async Task<List<RevenueByMonthDTO>> GetRevenueByMonthAsync()
        {
            var now = DateTime.Now;

            return await _context.Orders
                .Where(o => o.CreatedAt.HasValue &&
                            o.CreatedAt.Value.Year == now.Year &&
                            o.CreatedAt.Value.Month == now.Month)
                .GroupBy(o => new { o.CreatedAt.Value.Month, o.CreatedAt.Value.Year })
                .Select(g => new RevenueByMonthDTO
                {
                    Month = g.Key.Month,
                    Year = g.Key.Year,
                    TotalRevenue = g.Sum(o => o.TotalPrice)
                })
                .ToListAsync();
        }

        public async Task<List<RevenueByYearDTO>> GetRevenueByYearAsync()
        {
            return await _context.Orders
                .Where(o => o.CreatedAt.HasValue)
                .GroupBy(o => o.CreatedAt.Value.Year)
                .Select(g => new RevenueByYearDTO
                {
                    Year = g.Key,
                    TotalRevenue = g.Sum(o => o.TotalPrice)
                })
                .ToListAsync();
        }

        // Thêm phương thức để lấy doanh thu theo từng ngày trong tháng hiện tại
        public async Task<List<RevenueByDateDTO>> GetRevenueForEachDayInMonthAsync()
        {
            var now = DateTime.Now;
            var startOfMonth = new DateTime(now.Year, now.Month, 1);

            return await _context.Orders
                .Where(o => o.CreatedAt.HasValue &&
                            o.CreatedAt.Value.Year == now.Year &&
                            o.CreatedAt.Value.Month == now.Month)
                .GroupBy(o => o.CreatedAt.Value.Date)
                .Select(g => new RevenueByDateDTO
                {
                    Date = g.Key,
                    TotalRevenue = g.Sum(o => o.TotalPrice)
                })
                .ToListAsync();
        }
    }
}
