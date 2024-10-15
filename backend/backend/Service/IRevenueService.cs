using backend.DTOs;

namespace backend.Services
{
    public interface IRevenueService
    {
        Task<List<RevenueByDateDTO>> GetRevenueForTodayAsync();
        Task<List<RevenueByMonthDTO>> GetRevenueByMonthAsync();
        Task<List<RevenueByYearDTO>> GetRevenueByYearAsync();
        Task<List<RevenueByDateDTO>> GetRevenueForEachDayInMonthAsync();

    }
}
