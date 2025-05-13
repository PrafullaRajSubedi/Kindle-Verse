using System;
using System.ComponentModel.DataAnnotations;

namespace CourseWork.Model.Entity
{
    public class Review
    {
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; } 

        [Required]
        public int BookId { get; set; }

        // Navigation property for Books
        public Books Book { get; set; }

        // Rating validation: must be between 1 and 5
        [Range(1, 5)]
        public int Rating { get; set; }

        // Comment length validation
        [MaxLength(1000)]
        public string Comment { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

       
        public User User { get; set; }
    }
}
