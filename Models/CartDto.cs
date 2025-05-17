namespace Kindle_Verse.Models
{
    public class CartDto
    {
        public int Id { get; set; }
        public long UserId { get; set; }
        public List<CartItemDto> CartItems { get; set; }
    }
}
