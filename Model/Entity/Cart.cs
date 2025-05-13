using CourseWork.Model.Entity;

public class Cart
{
    public int Id { get; set; }

    // Foreign Key for User
    public int UserId { get; set; }  

    // Navigation property for User
    public User User { get; set; }

    
    public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();

    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
