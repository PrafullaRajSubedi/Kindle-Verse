using System.ComponentModel.DataAnnotations;

namespace Kindle_Verse.Database.Entities
{
    public class UpdateProfile
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? BookPurchased { get; set; }
    }
}