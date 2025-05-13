using System.ComponentModel.DataAnnotations;

namespace Kindle_Verse.Database.Entities
{
    public class Staff
    {
        public int Id { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }
    }
}