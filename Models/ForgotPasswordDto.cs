using System.ComponentModel.DataAnnotations;

namespace Kindle_Verse.Models
{
    public class ForgotPasswordDto
    {
        [Required]
        public string Email { get; set; }
    }
}
