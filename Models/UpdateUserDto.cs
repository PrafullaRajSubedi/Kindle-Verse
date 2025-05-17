using System.ComponentModel.DataAnnotations;

namespace Kindle_Verse.Models
{
    public class UpdateUserDto
    {
        [Required]
        [StringLength(50, MinimumLength = 2)]
        public required string FirstName { get; set; }

        [Required]
        [StringLength(50, MinimumLength = 2)]
        public required string LastName { get; set; }

        // Password is optional during update
        [StringLength(100, MinimumLength = 8)]
        public string? Password { get; set; }
    }
}