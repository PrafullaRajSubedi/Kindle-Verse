using System.ComponentModel.DataAnnotations;

namespace Kindle_Verse.Models
{
    public class ResendOTPDto
    {
        [Required, EmailAddress]
        public string Email { get; set; }
    }
}