namespace CourseWork.Model.Entity
{
    public class Purchase
    {
        public int Id { get; set; }

        // Foreign Key for User
        public int UserId { get; set; }  // ✅ int, consistent with User

        // Navigation property for User
        public User User { get; set; }

        // Foreign Key for Book
        public int BookId { get; set; }

        // Navigation property for Book
        public Books Book { get; set; }

        // Date of purchase (defaults to the current UTC time)
        public DateTime PurchaseDate { get; set; } = DateTime.UtcNow;
    }
}
