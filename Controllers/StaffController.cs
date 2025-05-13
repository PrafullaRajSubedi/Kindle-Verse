using Microsoft.AspNetCore.Mvc;
using Kindle_Verse.Database;
using Kindle_Verse.Models;
using System.Linq;

namespace Kindle_Verse.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaffController : ControllerBase
    {
        private readonly AppDbContext _db;

        public StaffController(AppDbContext db)
        {
            _db = db;
        }

        [HttpPost("login")]
        public IActionResult Login(StaffLoginDto dto)
        {
            var staff = _db.Staffs.FirstOrDefault(s => s.Email == dto.Email);
            if (staff == null || !BCrypt.Net.BCrypt.Verify(dto.Password, staff.PasswordHash))
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            return Ok(new { message = "Login successful" });
        }
    }
}