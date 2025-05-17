namespace Kindle_Verse.Models
{
    public class CartItem
    {
        public int Id { get; set; }

        // Foreign Key for Cart
        public int CartId { get; set; }

        // Navigation property for Cart
        public Cart Cart { get; set; }

        // Foreign Key for Book
        public int BookId { get; set; }

        // Navigation property for Book
        public Book Book { get; set; }

        // The quantity of the book in the cart
        public int Quantity { get; set; }


    }
}