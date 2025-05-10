using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Kindle_Verse.Models;
using Kindle_Verse.Models.Requests;
using System.Linq;
using System.Threading.Tasks;

namespace Kindle_Verse.Controllers
{
    [ApiController]
    [Route("api/admin")]
    public class BookController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BookController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Create a new book
        [HttpPost("create-book")]
        public async Task<IActionResult> CreateBook([FromBody] BookDto bookDto)
        {
            if (bookDto == null)
            {
                return BadRequest("Book details cannot be null.");
            }

            var book = new Book
            {
                Title = bookDto.Title,
                ISBN = bookDto.ISBN,
                Description = bookDto.Description,
                Format = bookDto.Format,
                Language = bookDto.Language,
                Genre = bookDto.Genre,
                Publisher = bookDto.Publisher,
                PublicationDate = bookDto.PublicationDate.ToUniversalTime(), // Convert to UTC
                Price = bookDto.Price,
                Stock = bookDto.Stock,
                Discount = bookDto.Discount,
                IsOnSale = bookDto.IsOnSale,
                DiscountStartDate = bookDto.DiscountStartDate?.ToUniversalTime(), // Convert to UTC
                DiscountEndDate = bookDto.DiscountEndDate?.ToUniversalTime(), // Convert to UTC
                CoverImagePath = bookDto.CoverImagePath
            };

            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Book created successfully", book });
        }

        // Get all books
        [HttpGet("manage-books")]
        public IActionResult GetAllBooks()
        {
            var books = _context.Books.ToList();
            return Ok(books);
        }

        [HttpPut("update-book/{id}")]
        public async Task<IActionResult> UpdateBook(int id, [FromBody] BookDto bookDto)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound("Book not found.");
            }

            book.Title = bookDto.Title;
            book.ISBN = bookDto.ISBN;
            book.Description = bookDto.Description;
            book.Format = bookDto.Format;
            book.Language = bookDto.Language;
            book.Genre = bookDto.Genre;
            book.Publisher = bookDto.Publisher;
            book.PublicationDate = bookDto.PublicationDate.ToUniversalTime();
            book.Price = bookDto.Price;
            book.Stock = bookDto.Stock;
            book.Discount = bookDto.Discount;
            book.IsOnSale = bookDto.IsOnSale;
            book.DiscountStartDate = bookDto.DiscountStartDate?.ToUniversalTime();
            book.DiscountEndDate = bookDto.DiscountEndDate?.ToUniversalTime();
            book.CoverImagePath = bookDto.CoverImagePath;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Book updated successfully", book });
        }


        // Delete a book
        [HttpDelete("delete-book/{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound("Book not found.");
            }

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Book deleted successfully" });
        }


    }
}
