namespace Kindle_Verse.Models
{
    public class AddBookDto
    {
        public string? Title { get; set; }

        public string? Author { get; set; }

        public decimal Price { get; set; }

        public bool OnSale { get; set; }
    }
}
