using Microsoft.AspNetCore.Mvc;
using Kindle_Verse.Models;
using Kindle_Verse.Services;

namespace Kindle_Verse.Controllers
{
    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtTokenGenerator _jwt;

        public AdminController(ApplicationDbContext context, JwtTokenGenerator jwt)
        {
            _context = context;
            _jwt = jwt;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] AdminLoginRequest request)
        {
            var admin = _context.Admins.FirstOrDefault(a => a.Username == request.Username && a.Password == request.Password);
            if (admin == null)
            {
                return Unauthorized(new { message = "Invalid credentials" });
            }

            var token = _jwt.GenerateToken(admin);

            return Ok(new AuthResponse
            {
                Token = token,
                AdminId = admin.Id,
                Role = "Admin"
            });
        }
    }
}
