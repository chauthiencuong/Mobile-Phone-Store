using backend.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Model
{
    public class User
    {
        public int Id { get; set; }
        public string Username  { get; set; }
        public string Password  { get; set; }
        public string Email  { get; set; }
        public string Phone  { get; set; }
        public string Name  { get; set; }
        public string? ImageUser  { get; set; }
        public string Role { get; set; }
        public string? GoogleId { get; set; }
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
