using Kindle_Verse.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace Kindle_Verse.Database.Entities
{
    public class Bookmark
    {
        public int Id { get; set; }

        public long UserId { get; set; }
        [ForeignKey("UserId")]
        public User User { get; set; }

        public int BookId { get; set; }
        [ForeignKey("BookId")]
        public Book Book { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
