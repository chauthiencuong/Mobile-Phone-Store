namespace backend.DTOs
{
    public class RevenueByDateDTO
    {
        public DateTime Date { get; set; }
        public double TotalRevenue { get; set; }
    }


    public class RevenueByMonthDTO
    {
        public int Month { get; set; }
        public int Year { get; set; }
        public double TotalRevenue { get; set; }
    }

    public class RevenueByYearDTO
    {
        public int Year { get; set; }
        public double TotalRevenue { get; set; }
    }
}
