
using Kindle_Verse.Models;
using Kindle_Verse.Database.Entities;

public class Cart
{
    public int Id { get; set; }

    // Foreign Key for User
    public long UserId { get; set; }

    // Navigation property for User
    public User User { get; set; } = null!;


    public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();


    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
