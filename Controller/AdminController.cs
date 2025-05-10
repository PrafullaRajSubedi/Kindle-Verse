using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Kindle_Verse.Models;
using Kindle_Verse.Models.Requests;
using Kindle_Verse.Services;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Kindle_Verse.Controllers
{
    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtTokenGenerator _jwt;
        private readonly IMemoryCache _memoryCache;
        private readonly IEmailService _emailService;

        public AdminController(ApplicationDbContext context, JwtTokenGenerator jwt, IMemoryCache memoryCache, IEmailService emailService)
        {
            _context = context;
            _jwt = jwt;
            _memoryCache = memoryCache;
            _emailService = emailService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] AdminLoginRequest request)
        {
            var admin = _context.Admins.FirstOrDefault(a => a.Username == request.Username);
            if (admin == null)
            {
                return Unauthorized(new { message = "Invalid credentials" });
            }

            if (admin.Password != request.Password)
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

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordAdminDto dto)
        {
            var admin = _context.Admins.FirstOrDefault(a => a.Email == dto.Email);
            if (admin == null)
                return Ok("If the email exists, a reset code has been sent.");

            var otp = new Random().Next(100000, 999999).ToString();

            // Cache OTP for 10 minutes, using email as the key
            _memoryCache.Set($"AdminOTP_{dto.Email}", otp, TimeSpan.FromMinutes(10));

            await _emailService.SendEmailAsync(dto.Email, "Admin Password Reset", $"Your OTP is: {otp}");

            return Ok("Reset code sent to email.");
        }
    

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordAdminDto dto)
        {
            // Retrieve OTP from memory cache using email as part of the key
            var cachedOtp = _memoryCache.Get<string>($"AdminOTP_{dto.Otp}");
            

            if (dto.NewPassword != dto.ConfirmPassword)
            {
                return BadRequest("New password and confirm password do not match.");
            }

            // Find admin by email (assuming OTP is linked to admin's email)
            var admin = _context.Admins.FirstOrDefault(a => a.Email == dto.Otp); // Error here, should get the email from another source, not OTP.
            if (admin == null)
                return BadRequest("Admin not found.");

            admin.Password = dto.NewPassword;
            await _context.SaveChangesAsync();

            return Ok("Password has been reset successfully.");
        }
    }

}
