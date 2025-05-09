using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using Kindle_Verse.Models;
using Kindle_Verse.Service;
using Kindle_Verse.Database.Entities;
using System.Net.Mail;
using System.Net;

namespace Kindle_Verse.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly JwtService _jwtService;
        private readonly RoleManager<IdentityRole<long>> _roleManager;
        private readonly IMemoryCache _memoryCache;
        private readonly EmailSettings _emailSettings;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            JwtService jwtService,
            RoleManager<IdentityRole<long>> roleManager,
            IMemoryCache memoryCache,
            IOptions<EmailSettings> emailSettings,
            ILogger<AuthController> logger)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtService = jwtService;
            _roleManager = roleManager;
            _memoryCache = memoryCache;
            _emailSettings = emailSettings?.Value ?? throw new ArgumentNullException(nameof(emailSettings));
            _logger = logger;
        }

        // Register endpoint
        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser(UserRegisterDto dto)
        {
            try
            {
                // Ensure that FirstName and LastName are populated correctly
                if (string.IsNullOrEmpty(dto.FirstName) || string.IsNullOrEmpty(dto.LastName))
                {
                    return BadRequest("First name and Last name are required.");
                }

                // Check if user already exists
                var existingUser = await _userManager.FindByEmailAsync(dto.Email);
                if (existingUser != null)
                {
                    if (existingUser.EmailConfirmed)
                    {
                        return BadRequest("Email is already confirmed. Please log in.");
                    }

                    // User exists but hasn't confirmed email yet
                    return Ok("Please verify your email. OTP has been resent.");
                }

                var user = new User
                {
                    UserName = dto.Email,
                    FirstName = dto.FirstName,
                    LastName = dto.LastName,
                    Email = dto.Email,
                    EmailConfirmed = false
                };

                var result = await _userManager.CreateAsync(user, dto.Password!);
                if (!result.Succeeded) return BadRequest(result.Errors);

                // Generate OTP
                var otp = GenerateOTP();

                // Store OTP temporarily in the memory cache
                _memoryCache.Set($"OTP_{user.Email}", otp, TimeSpan.FromMinutes(10));  // OTP expires after 10 minutes

                // Send OTP to user's email
                var emailBody = $"Your verification code is: {otp}";

                try
                {
                    SendEmail(user.Email, "Email Verification", emailBody);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to send verification email to {Email}", user.Email);
                    // Continue registration process even if email fails
                    // The user can request a resend later
                }

                // Check if "User" role exists, otherwise create it
                var roleExists = await _roleManager.RoleExistsAsync("User");
                if (!roleExists)
                {
                    var role = new IdentityRole<long>("User");
                    await _roleManager.CreateAsync(role);
                }

                await _userManager.AddToRoleAsync(user, "User");

                return Ok(new { message = "Registration successful. OTP sent to email.", email = user.Email });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in RegisterUser");
                return StatusCode(500, ex.Message);
            }
        }

        // OTP Generation Method
        private string GenerateOTP()
        {
            using (var rng = new System.Security.Cryptography.RNGCryptoServiceProvider())
            {
                byte[] buffer = new byte[4];
                rng.GetBytes(buffer);

                // Convert the byte array to a positive integer
                int otp = Math.Abs(BitConverter.ToInt32(buffer, 0));

                // Ensure the OTP is a 6-digit number
                otp = otp % 1000000;
                return otp.ToString("D6"); // Format as a 6-digit number
            }
        }


        // Send Email Method
        private void SendEmail(string email, string subject, string body)
        {
            if (string.IsNullOrEmpty(email))
            {
                throw new ArgumentException("Email address cannot be null or empty", nameof(email));
            }

            // Validate email settings before proceeding
            if (_emailSettings == null)
            {
                throw new InvalidOperationException("EmailSettings are null");
            }

            // Check for missing email settings
            if (string.IsNullOrEmpty(_emailSettings.FromEmail))
            {
                throw new InvalidOperationException("EmailSettings.FromEmail is not configured");
            }

            if (string.IsNullOrEmpty(_emailSettings.SmtpServer))
            {
                throw new InvalidOperationException("EmailSettings.SmtpServer is not configured");
            }

            if (string.IsNullOrEmpty(_emailSettings.Username) || string.IsNullOrEmpty(_emailSettings.Password))
            {
                throw new InvalidOperationException("Email credentials are not properly configured");
            }

            var message = new MailMessage
            {
                From = new MailAddress(_emailSettings.FromEmail),
                Subject = subject,
                Body = body,
                IsBodyHtml = false
            };

            message.To.Add(email);

            var smtpClient = new SmtpClient(_emailSettings.SmtpServer)
            {
                Port = _emailSettings.Port,
                Credentials = new NetworkCredential(_emailSettings.Username, _emailSettings.Password),
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false
            };

            try
            {
                smtpClient.Send(message);
                _logger.LogInformation("Email sent successfully to {Email}", email);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending email to {Email}", email); // Log full exception details
                throw; // Re-throw to be handled by the calling method
            }
        }


        // Add a new endpoint for resending OTP
        [HttpPost("resend-otp")]
        public async Task<IActionResult> ResendOTP(ResendOTPDto dto)
        {
            try
            {
                if (string.IsNullOrEmpty(dto.Email))
                {
                    return BadRequest("Email is required.");
                }

                var user = await _userManager.FindByEmailAsync(dto.Email);
                if (user == null)
                {
                    return NotFound("User not found.");
                }

                if (user.EmailConfirmed)
                {
                    return BadRequest("Email is already confirmed. Please log in.");
                }

                // Generate new OTP
                var otp = GenerateOTP();

                // Store new OTP temporarily in the memory cache (replace previous OTP if exists)
                _memoryCache.Set($"OTP_{user.Email}", otp, TimeSpan.FromMinutes(10));

                // Send new OTP to user's email
                var emailBody = $"Your new verification code is: {otp}";

                try
                {
                    SendEmail(user.Email, "New Email Verification Code", emailBody);
                    return Ok(new { message = "New verification code sent to your email." });
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to send new verification email to {Email}", user.Email);
                    return StatusCode(500, "Failed to send verification email. Please try again later.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in ResendOTP");
                return StatusCode(500, ex.Message);
            }
        }

        // Verify Email endpoint
        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail(EmailVerificationDto dto)
        {
            try
            {
                // Check if email and OTP are provided
                if (string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.Otp))
                {
                    return BadRequest("Email and OTP are required.");
                }

                // Get OTP from memory cache
                var cachedOtp = _memoryCache.Get<string>($"OTP_{dto.Email}");

                if (cachedOtp == null)
                    return Unauthorized("OTP has expired or is not valid.");

                if (cachedOtp != dto.Otp)
                    return Unauthorized("Invalid OTP.");

                // OTP verified successfully, update user as verified
                var user = await _userManager.FindByEmailAsync(dto.Email);
                if (user == null) return Unauthorized("User not found.");

                // Mark the user as verified
                user.EmailConfirmed = true;
                await _userManager.UpdateAsync(user);

                // Remove the OTP from cache once verified
                _memoryCache.Remove($"OTP_{dto.Email}");

                return Ok("Email successfully verified.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in VerifyEmail");
                return StatusCode(500, ex.Message);  // Send the error message as part of response for better debugging
            }
        }


        // Forgot Password endpoint
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDto dto)
        {
            try
            {
                if (string.IsNullOrEmpty(dto.Email))
                    return BadRequest("Email is required.");

                var user = await _userManager.FindByEmailAsync(dto.Email);
                if (user == null)
                    return Ok("If the email exists, a reset link has been sent."); // Security best practice

                if (!user.EmailConfirmed)
                    return BadRequest("Please verify your email first.");

                var otp = GenerateOTP();
                _memoryCache.Set($"OTP_{dto.Email}", otp, TimeSpan.FromMinutes(10));

                try
                {
                    SendEmail(user.Email, "Password Reset Code",
                        $"Your password reset code is: {otp}");

                    return Ok(new { message = "Reset instructions sent to email." });
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Email send failed");
                    return StatusCode(500, "Failed to send email. Please try again later.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ForgotPassword error");
                return StatusCode(500, "An error occurred");
            }
        }


        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto dto)
        {
            try
            {
                // Validate the input parameters
                if (string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.Otp) || string.IsNullOrEmpty(dto.NewPassword))
                {
                    return BadRequest("Email, OTP, and new password are required.");
                }

                //// Check if the OTP is valid (compare with the one in memory cache)
                //var cachedOtp = _memoryCache.Get<string>($"OTP_{dto.Email}");
                //if (cachedOtp == null || cachedOtp != dto.Otp)
                //{
                //    return Unauthorized("Invalid or expired OTP.");
                //}

                // Find the user
                var user = await _userManager.FindByEmailAsync(dto.Email);
                if (user == null)
                {
                    return NotFound("User not found.");
                }

                // Reset the password
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var result = await _userManager.ResetPasswordAsync(user, token, dto.NewPassword);

                if (!result.Succeeded)
                {
                    return BadRequest(result.Errors.Select(e => e.Description));
                }

                // Remove OTP from cache
                _memoryCache.Remove($"OTP_{dto.Email}");

                return Ok("Password has been reset successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in ResetPassword");
                return StatusCode(500, ex.Message);  // Send the error message as part of response for better debugging
            }
        }




        // Login endpoint
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            try
            {
                User? user = await _userManager.FindByEmailAsync(dto.Email!);
                if (user == null)
                    return Unauthorized("Email has not been registered");

                if (!user.EmailConfirmed)
                    return Unauthorized("Please verify your email before logging in.");

                var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password!, lockoutOnFailure: true);

                if (result.Succeeded)
                {
                    // Pass the user object to GenerateToken method
                    var token = _jwtService.GenerateToken(user);

                    return Ok(new
                    {
                        Message = "Login Success",
                        Token = token,
                        User = new
                        {
                            Id = user.Id,
                            Email = user.Email,
                            FirstName = user.FirstName,
                            LastName = user.LastName
                        }
                    });
                }
                return Unauthorized("Password is not valid");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in Login");
                return StatusCode(500, ex.Message);
            }
        }

    }
}
