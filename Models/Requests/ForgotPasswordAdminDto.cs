using System.ComponentModel.DataAnnotations;

namespace Kindle_Verse.Models.Requests
{
    public class ForgotPasswordAdminDto
    {
        [Required]
        public string Email { get; set; }
    }
}
