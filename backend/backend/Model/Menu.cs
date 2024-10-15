namespace backend.Model
{
    public class Menu
    {
        public int Id { get; set; }
        public string Slug { get; set; }
        public string Name { get; set; }
        public string Link { get; set; }
        public int Status {  get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int CreatedBy { get; set; }
        public int UpdatedBy { get; set; }
        public User CreatedByUser { get; set; }
        public User UpdatedByUser { get; set; }
    }
}
