using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CourseWork.Model.Entity
{
    public class User
    {
        [Key]
        public string UserId { get; set; } = string.Empty;

        [Required]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        public string LastName { get; set; } = string.Empty;

        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;

        [Compare(nameof(Password))]
        public string ConfirmPassword { get; set; } = string.Empty;

        public Cart Cart { get; set; }
        public ICollection<Purchase> Purchases { get; set; }
    }
}
