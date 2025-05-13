using CourseWork.Model.Entity;

public class Cart
{
    public int Id { get; set; }

    // Foreign Key for User
    public int UserId { get; set; }  // ✅ This must be int, consistent with the User entity

    // Navigation property for User
    public User User { get; set; }

    // Collection of CartItems (one-to-many relationship)
    public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();

    // The date when the cart was created (defaults to current UTC time)
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
