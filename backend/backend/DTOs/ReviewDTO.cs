namespace backend.DTOs
{
    public class ReViewDTO
    {
        public int Id { get; internal set; }
        public int ProductId { get; set; }
        public int UserId { get; set; }
        public string Comment { get; set; }
        public int Rating { get; set; }
        public DateTime? CreatedAt { get; internal set; }
        public DateTime? UpdatedAt { get; internal set; }
        public ProductDTO Product { get; set; }
        public UserDTO User { get; set; }

    }
    public class AddReViewDTO
    {
        public int ProductId { get; set; }
        public int UserId { get; set; }
        public string Comment { get; set; }
        public int Rating { get; set; }
    }
}
