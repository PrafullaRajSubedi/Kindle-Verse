using System.ComponentModel.DataAnnotations;

namespace Kindle_Verse.Models.Requests
{
    public class ResetPasswordAdminDto
    {

        [Required]
        public string Otp { get; set; }

        [Required]
        public string NewPassword { get; set; }

        [Required]
        public string ConfirmPassword { get; set; } 
    }
}
