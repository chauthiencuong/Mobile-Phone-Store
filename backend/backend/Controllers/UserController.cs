using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Data;
using backend.DTOs.Auth;
using backend.DTOs;
using backend.Model;
using Newtonsoft.Json.Linq;
using Azure.Core;

namespace Backend_Ecommerce.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly string _jwtSecret;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;

        public UserController(DataContext context, IMapper mapper, IConfiguration configuration, IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _mapper = mapper;
            _jwtSecret = configuration["Jwt:Secret"];
            _httpClientFactory = httpClientFactory;

        }
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDTO>> GetUserById(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            var userDTO = _mapper.Map<UserDTO>(user);
            return Ok(userDTO);
        }

        [HttpGet]
        public ActionResult<IEnumerable<UserDTO>> GetUsers()
        {
            var users = _context.Users.ToList();
            var userDTOs = _mapper.Map<List<UserDTO>>(users);
            return Ok(userDTOs);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, [FromForm] UpdateUserDTO updateUserDTO)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            if (updateUserDTO.ImageFile != null && updateUserDTO.ImageFile.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "User");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var uniqueFileName = Guid.NewGuid().ToString() + "_" + updateUserDTO.ImageFile.FileName;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await updateUserDTO.ImageFile.CopyToAsync(fileStream);
                }

                if (!string.IsNullOrEmpty(user.ImageUser))
                {
                    var oldImagePath = Path.Combine(Directory.GetCurrentDirectory(), user.ImageUser.TrimStart('/'));
                    if (System.IO.File.Exists(oldImagePath))
                    {
                        System.IO.File.Delete(oldImagePath);
                    }
                }

                user.ImageUser = Path.Combine("Uploads", "User", uniqueFileName);
            }

            user.Name = updateUserDTO.Name;
            user.Email = updateUserDTO.Email;
            user.Phone = updateUserDTO.Phone;
            user.Username = updateUserDTO.Username;
            user.Role = updateUserDTO.Role;
            // Hash the password if it's not null or empty
            if (!string.IsNullOrWhiteSpace(updateUserDTO.Password))
            {
                user.Password = BCrypt.Net.BCrypt.HashPassword(updateUserDTO.Password);
            }

            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpPost("add-admin")]
        public async Task<IActionResult> AddAdmin([FromBody] RegisterDTO registerDTO)
        {
            if (string.IsNullOrWhiteSpace(registerDTO.Username) || string.IsNullOrWhiteSpace(registerDTO.Password))
            {
                return BadRequest("Username and password are required.");
            }

            // Kiểm tra xem username đã tồn tại chưa
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == registerDTO.Username);
            if (existingUser != null)
            {
                return Conflict("Username already exists.");
            }

            // Tạo người dùng mới với role là admin
            var adminUser = new User
            {
                Name = registerDTO.Name,
                Email = registerDTO.Email,
                Phone = registerDTO.Phone,
                Username = registerDTO.Username,
                Password = BCrypt.Net.BCrypt.HashPassword(registerDTO.Password),
                Role = "Admin",
            };

            _context.Users.Add(adminUser);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUserById), new { id = adminUser.Id }, adminUser);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDTO registerDTO)
        {
            if (string.IsNullOrWhiteSpace(registerDTO.Username) || string.IsNullOrWhiteSpace(registerDTO.Password))
            {
                return BadRequest("Username and password are required.");
            }

            // Check if the username already exists
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == registerDTO.Username);
            if (existingUser != null)
            {
                return Conflict("Username already exists.");
            }

            // Create new user
            var user = new User
            {
                Name = registerDTO.Name,
                Email = registerDTO.Email,
                Phone = registerDTO.Phone,
                Username = registerDTO.Username,
                Password = BCrypt.Net.BCrypt.HashPassword(registerDTO.Password),
                Role = "User",
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Generate JWT token
            var token = GenerateJwtToken(user.Id);

            return CreatedAtAction(nameof(Register), new { id = user.Id }, new { token });
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO)
        {
            if (string.IsNullOrWhiteSpace(loginDTO.Username) || string.IsNullOrWhiteSpace(loginDTO.Password))
            {
                return BadRequest("Username and password are required.");
            }

            // Find user
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == loginDTO.Username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDTO.Password, user.Password))
            {
                return Unauthorized("Invalid username or password.");
            }

            // Generate JWT token
            var token = GenerateJwtToken(user.Id);

            return Ok(new { token });
        }
        [HttpPost("adminLogin")]
        public async Task<IActionResult> AdminLogin(LoginDTO loginDTO)
        {
            if (string.IsNullOrWhiteSpace(loginDTO.Username) || string.IsNullOrWhiteSpace(loginDTO.Password))
            {
                return BadRequest("Username and password are required.");
            }

            // Tìm user theo username
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == loginDTO.Username);

            // Kiểm tra xem user có tồn tại và mật khẩu có đúng không
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDTO.Password, user.Password))
            {
                return Unauthorized("Invalid username or password.");
            }

            // Kiểm tra xem Role của user có phải là Admin không
            if (user.Role != "Admin")
            {
                return Unauthorized("You do not have permission to access this resource.");
            }

            // Generate JWT token cho admin
            var token = GenerateJwtToken(user.Id);

            return Ok(new { token });
        }

        public class TokenRequest
        {
            public string Token { get; set; }
        }
        private string GenerateJwtToken(int userId)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSecret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim("id", userId.ToString()) }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
        [HttpPost("userInfo")]
        public async Task<ActionResult<UserDTO>> GetUserInfoFromToken([FromBody] TokenRequest tokenRequest)
        {
            try
            {
                // Lấy token từ request body
                string token = tokenRequest.Token;

                if (string.IsNullOrEmpty(token))
                {
                    return BadRequest("Token is missing.");
                }

                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_jwtSecret);

                // Thiết lập các tham số kiểm tra token
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                };

                ClaimsPrincipal claimsPrincipal;

                try
                {
                    // Xác thực và giải mã token
                    claimsPrincipal = tokenHandler.ValidateToken(token, validationParameters, out _);
                }
                catch (SecurityTokenExpiredException)
                {
                    return BadRequest("Token has expired.");
                }
                catch (SecurityTokenInvalidSignatureException)
                {
                    return BadRequest("Invalid token signature.");
                }
                catch (SecurityTokenInvalidIssuerException)
                {
                    return BadRequest("Invalid token issuer.");
                }
                catch (SecurityTokenInvalidAudienceException)
                {
                    return BadRequest("Invalid token audience.");
                }
                catch (Exception ex)
                {
                    return BadRequest($"Invalid token: {ex.Message}");
                }

                // Lấy thông tin userId từ claims
                var userIdClaim = claimsPrincipal.FindFirst("id");

                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                {
                    return BadRequest("Invalid token.");
                }

                // Tìm người dùng theo userId
                var user = await _context.Users.FindAsync(userId);

                if (user == null)
                {
                    return NotFound("User not found.");
                }

                // Chuyển đổi thông tin người dùng sang DTO để trả về
                var userDTO = _mapper.Map<UserDTO>(user);

                return Ok(userDTO);
            }
            catch (Exception ex)
            {
                // Xử lý lỗi tổng quát
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("google")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleTokenRequest request)
        {
            var httpClient = _httpClientFactory.CreateClient();
            var response = await httpClient.GetAsync($"https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={request.IdToken}");

            if (!response.IsSuccessStatusCode)
            {
                return BadRequest(new { success = false, message = "Invalid token" });
            }

            var content = await response.Content.ReadAsStringAsync();
            var json = JObject.Parse(content);
            var googleId = json["sub"]?.ToString();
            var email = json["email"]?.ToString();

            if (googleId == null || email == null)
            {
                return BadRequest(new { success = false, message = "Invalid token data" });
            }

            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (existingUser != null)
            {
                existingUser.GoogleId = googleId;
                existingUser.ImageUser = json["picture"]?.ToString();
                _context.Users.Update(existingUser);
            }
            else
            {
                var user = new User
                {
                    GoogleId = googleId,
                    Name = json["name"]?.ToString(),
                    Email = email,
                    ImageUser = json["picture"]?.ToString(),
                    Username = "Default",
                    Password = BCrypt.Net.BCrypt.HashPassword("Default"),
                    Phone = "Default    ",
                    Role = "User"
                };
                _context.Users.Add(user);
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = "Login successful",
                user = existingUser ?? new User
                {
                    GoogleId = googleId,
                    Name = json["name"]?.ToString(),
                    Email = email,
                    ImageUser = json["picture"]?.ToString(),
                    Username = "Default",
                    Password = BCrypt.Net.BCrypt.HashPassword("Default"),
                    Phone = "Default",
                    Role = "User"
                }
            });
        }
    }
    public class GoogleTokenRequest
    {
        public string IdToken { get; set; }
    }
}
