using System;
using System.ComponentModel.DataAnnotations;

namespace CourseWork.Model.Entity
{
    public class Review
    {
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; }
        public User User { get; set; }

        [Required]
        public int BookId { get; set; }
        public Books Book { get; set; }

        [Range(1, 5)]
        public int Rating { get; set; }

        [MaxLength(1000)]
        public string Comment { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
