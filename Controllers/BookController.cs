using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Kindle_Verse.Models;
using Kindle_Verse.Models.Dtos;
using System;
using System.Linq;
using System.Threading.Tasks;
using Kindle_Verse.Database;

namespace Kindle_Verse.Controllers
{
    [ApiController]
    [Route("api/admin")]
    public class BookController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BookController(AppDbContext context)
        {
            _context = context;
        }

        // Adds a brand-new book to our catalog
        [HttpPost("create-book")]
        public async Task<IActionResult> CreateBook([FromBody] BookDto dto)
        {
            if (dto == null)
                return BadRequest("Book details cannot be null.");

            var book = new Book
            {
                Title = dto.Title,
                Author = dto.Author,
                ISBN = dto.ISBN,
                Description = dto.Description,
                Format = dto.Format,
                Language = dto.Language,
                Genre = dto.Genre,
                Publisher = dto.Publisher,
                PublicationDate = dto.PublicationDate.ToUniversalTime(),

                // This is the book's normal (non-sale) price
                Price = dto.OriginalPrice,
                Stock = dto.Stock,

                // How much we knock off when it’s on sale
                Discount = dto.Discount ?? 0m,

                // Whether or not the book should be on sale
                IsOnSale = dto.IsOnSale,
                DiscountStartDate = dto.DiscountStartDate?.ToUniversalTime(),
                DiscountEndDate = dto.DiscountEndDate?.ToUniversalTime(),

                CoverImagePath = dto.CoverImagePath
            };

            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Book created successfully", book });
        }

        // Returns every book, and figures out if a timed sale is happening right now
        [HttpGet("manage-books")]
        public IActionResult GetAllBooks()
        {
            var now = DateTime.UtcNow;

            var books = _context.Books
                .Select(b => new
                {
                    b.Id,
                    b.Title,
                    b.Author,
                    b.Publisher,
                    b.Genre,
                    b.ISBN,
                    b.Format,
                    b.Language,
                    b.PublicationDate,

                    // The normal price before any discount
                    OriginalPrice = b.Price,
                    // The amount to subtract when on sale
                    Discount = b.Discount,

                    // Check if today falls within the sale period
                    IsOnSale = b.IsOnSale
                                      && b.DiscountStartDate <= now
                                      && b.DiscountEndDate >= now,

                    // What the customer actually pays if a sale is active
                    SalePrice = (b.IsOnSale
                                      && b.DiscountStartDate <= now
                                      && b.DiscountEndDate >= now)
                                     ? b.Price - b.Discount
                                     : b.Price,

                    b.Stock,
                    b.Description,
                    b.DiscountStartDate,
                    b.DiscountEndDate,
                    b.CoverImagePath
                })
                .ToList();

            return Ok(books);
        }

        // Updates an existing book’s details
        [HttpPut("update-book/{id}")]
        public async Task<IActionResult> UpdateBook(int id, [FromBody] BookDto dto)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
                return NotFound("Book not found.");

            book.Title = dto.Title;
            book.Author = dto.Author;
            book.ISBN = dto.ISBN;
            book.Description = dto.Description;
            book.Format = dto.Format;
            book.Language = dto.Language;
            book.Genre = dto.Genre;
            book.Publisher = dto.Publisher;
            book.PublicationDate = dto.PublicationDate.ToUniversalTime();

            // Update the normal price and discount amount
            book.Price = dto.OriginalPrice;
            book.Stock = dto.Stock;
            book.Discount = dto.Discount ?? 0m;

            // Refresh the sale flags and window
            book.IsOnSale = dto.IsOnSale;
            book.DiscountStartDate = dto.DiscountStartDate?.ToUniversalTime();
            book.DiscountEndDate = dto.DiscountEndDate?.ToUniversalTime();

            book.CoverImagePath = dto.CoverImagePath;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Book updated successfully", book });
        }

        // Removes a book from our catalog
        [HttpDelete("delete-book/{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
                return NotFound("Book not found.");

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Book deleted successfully" });
        }
    }
}