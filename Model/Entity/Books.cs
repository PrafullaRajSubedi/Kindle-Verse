namespace CourseWork.Model.Entity
{
    public class Books
    {
        // This is the primary key for the Books entity
        public int Id { get; set; }  // Int type primary key, appropriate for the relationship mapping

        public string Title { get; set; }           // Title of the book
        public string ISBN { get; set; }            // ISBN identifier of the book
        public string Author { get; set; }          // Author of the book
        public string Description { get; set; }     // Short description or synopsis of the book
        public string Format { get; set; }          // The format of the book (e.g., Hardcover, Paperback, eBook)
        public string Language { get; set; }        // Language of the book
        public string Genre { get; set; }           // Genre of the book (e.g., Fiction, Non-Fiction, Mystery)
        public string Publisher { get; set; }       // Publisher of the book
        public DateTime PublicationDate { get; set; } // Date when the book was published
        public decimal OriginalPrice { get; set; }  // The original price of the book
        public int Stock { get; set; }              // Quantity of the book available in stock
        public decimal? Discount { get; set; }      // Discount applied to the book, nullable in case there's no discount
        public bool IsOnSale { get; set; }          // Indicates if the book is currently on sale
        public DateTime? DiscountStartDate { get; set; } // Start date of the discount period
        public DateTime? DiscountEndDate { get; set; }   // End date of the discount period
        public string CoverImagePath { get; set; }  // Path to the book's cover image
    }
}
