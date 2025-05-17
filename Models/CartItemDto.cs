namespace Kindle_Verse.Models
{
    public class CartItemDto
    {
        public int Id { get; set; }
        public int Quantity { get; set; }

        // Book Info
        public int BookId { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public decimal Price { get; set; }
        public string CoverImagePath { get; set; }
        public bool IsOnSale { get; set; }
    }
}
