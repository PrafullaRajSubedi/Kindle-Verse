using System.ComponentModel.DataAnnotations;

namespace Kindle_Verse.Models
{
    public class CreateAnnouncementDto
    {
        [Required]
        public string? Title { get; set; }

        public string? Message { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }
    }
}
