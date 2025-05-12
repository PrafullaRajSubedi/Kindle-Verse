using CourseWork.Model.Entity;

public class Cart
{
    public int Id { get; set; }

    public string UserId { get; set; }
    public User User { get; set; }

    public ICollection<CartItem> CartItems { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
