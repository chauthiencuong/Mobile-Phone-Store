﻿namespace backend.Model
{
    public class Promotion
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public double Discount { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsActive { get; set; }
        public ICollection<ProductPromotion> ProductPromotions { get; set; } = new List<ProductPromotion>();
    }
}
