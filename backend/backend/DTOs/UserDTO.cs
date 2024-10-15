namespace backend.DTOs
{
    public class UserDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string? ImageUser { get; set; }
        public string Role { get; set; }
        public string? GoogleId { get; set; }
    }
    public class UpdateUserDTO
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public IFormFile? ImageFile { get; set; }
    }
}
