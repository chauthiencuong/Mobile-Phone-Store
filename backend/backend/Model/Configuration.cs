namespace backend.Model
{
    public class Configuration
    {
        public int Id { get; set; }
        public string Value { get; set; }
        public ICollection<ProductVariant> ProductVariants { get; set; } = new List<ProductVariant>();
    }
}
