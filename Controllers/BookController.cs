using Kindle_Verse.Database.Entities;
using Kindle_Verse.Database;
using Microsoft.AspNetCore.Mvc;
using Kindle_Verse.Models;

namespace Kindle_Verse.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly AppDbContext _db;

        public BookController(AppDbContext db)
        {
            _db = db;
        }

        [HttpPost("add-book")]
        public IActionResult AddBook(AddBookDto dto)
        {
            var book = new Book
            {
                Title = dto.Title,
                Author = dto.Author,
                Price = dto.Price,
                OnSale = dto.OnSale
            };

            _db.Books.Add(book);
            _db.SaveChanges();

            return Ok("Book added successfully");
        }
    }
}
