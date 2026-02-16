using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using onlineMenu.Data;
using onlineMenu.Model;

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace onlineMenu.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // REGISTER
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] AuthDtos userDto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(userDto.username) || string.IsNullOrWhiteSpace(userDto.password))
                    return BadRequest("Username and password are required.");

                if (_context.Users.Any(u => u.username == userDto.username))
                    return BadRequest("Username already exists.");

                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(userDto.password);

                var user = new User
                {
                    username = userDto.username!,
                    password = hashedPassword,
                    role = string.IsNullOrWhiteSpace(userDto.role) ? "User" : userDto.role!
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return Ok(new { message = "User registered successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // LOGIN
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto loginDto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(loginDto.username) || string.IsNullOrWhiteSpace(loginDto.password))
                    return BadRequest("Username and password are required.");

                var user = _context.Users.FirstOrDefault(u => u.username == loginDto.username);
                if (user == null) return Unauthorized("User not found.");

                if (!BCrypt.Net.BCrypt.Verify(loginDto.password, user.password))
                    return Unauthorized("Invalid password.");

                var claims = new[]
                {
                    new Claim(ClaimTypes.Name, user.username),
                    new Claim(ClaimTypes.Role, user.role)
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: _config["Jwt:Issuer"],
                    audience: _config["Jwt:Audience"],
                    claims: claims,
                    expires: DateTime.Now.AddHours(6),
                    signingCredentials: creds
                );

                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    username = user.username,
                    role = user.role
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpGet("all")]
        public IActionResult GetAllUsers()
        {
            var users = _context.Users
                .Select(u => new { u.id, u.username, u.role })
                .ToList();
            return Ok(users);
        }
    }
}
