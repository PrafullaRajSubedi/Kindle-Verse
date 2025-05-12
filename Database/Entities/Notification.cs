using System.ComponentModel.DataAnnotations;

namespace Kindle_Verse.Database.Entities
{
    public class Notification
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public long UserId { get; set; } // assuming you're using Identity with long IDs

        [Required]
        [MaxLength(200)]
        public string? Message { get; set; }

        public bool IsRead { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
