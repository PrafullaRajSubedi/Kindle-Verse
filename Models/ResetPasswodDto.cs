using System.ComponentModel.DataAnnotations;
namespace Kindle_Verse.Models
{
    public class ResetPasswordDto
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string Otp { get; set; }

        [Required]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters long")]
        public string NewPassword { get; set; }

        public string? Token { get; set; } = null;
    }
}