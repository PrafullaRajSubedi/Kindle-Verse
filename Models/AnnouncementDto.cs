namespace Kindle_Verse.Models
{
    public class AnnouncementDto
    {
        public int Id { get; set; }

        public string? Title { get; set; }

        public string? Message { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}