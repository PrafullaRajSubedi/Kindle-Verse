using System.ComponentModel.DataAnnotations;

namespace Kindle_Verse.Models
{
    public class UpdatedProfileDto
    {
        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? BookPurchased { get; set; } = string.Empty;
    }
}