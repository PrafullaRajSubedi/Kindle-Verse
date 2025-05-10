using System;
using System.Collections.Generic;

namespace CourseWork.Model.Entity
{
    public class Cart
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public ICollection<CartItem> CartItems { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
