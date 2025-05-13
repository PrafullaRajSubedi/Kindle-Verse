using System.ComponentModel.DataAnnotations;

namespace Kindle_Verse.Models.Dtos
{
    public class ForgotPasswordAdminDto
    {
        [Required]
        public string Email { get; set; }
    }
}
