namespace backend.DTOs
{
    public class PromotionDTO
    {
        public string Name { get; set; } 
        public string Description { get; set; }
        public double Discount { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsActive { get; set; }
    }
}
