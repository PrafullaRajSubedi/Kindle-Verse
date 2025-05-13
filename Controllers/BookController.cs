using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CourseWork.Data;
using CourseWork.Model.Entity;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace CourseWork.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BooksController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchBooks(
        string searchQuery = "", 
        string sortBy = "Title", 
        bool descending = false, 
        string genre = "", 
        string author = "", 
        string publisher = "", 
        decimal? minPrice = null, 
        decimal? maxPrice = null 
    )
        {
            var booksQuery = _context.Books.AsQueryable();

            if (!string.IsNullOrEmpty(searchQuery))
            {
                booksQuery = booksQuery.Where(b => b.Title.Contains(searchQuery) ||
                                                   b.Description.Contains(searchQuery) ||
                                                   b.Author.Contains(searchQuery) ||
                                                   b.Publisher.Contains(searchQuery));
            }

            
            if (!string.IsNullOrEmpty(genre))
            {
                booksQuery = booksQuery.Where(b => b.Genre.Equals(genre, StringComparison.OrdinalIgnoreCase));
            }

            
            if (!string.IsNullOrEmpty(author))
            {
                booksQuery = booksQuery.Where(b => b.Author.Contains(author));
            }

       
            if (!string.IsNullOrEmpty(publisher))
            {
                booksQuery = booksQuery.Where(b => b.Publisher.Contains(publisher));
            }

            if (minPrice.HasValue)
            {
                booksQuery = booksQuery.Where(b => b.OriginalPrice >= minPrice);
            }
            if (maxPrice.HasValue)
            {
                booksQuery = booksQuery.Where(b => b.OriginalPrice <= maxPrice);
            }

          
            booksQuery = sortBy.ToLower() switch
            {
                "price" => descending ? booksQuery.OrderByDescending(b => b.OriginalPrice) : booksQuery.OrderBy(b => b.OriginalPrice),
                "publicationdate" => descending ? booksQuery.OrderByDescending(b => b.PublicationDate) : booksQuery.OrderBy(b => b.PublicationDate),
                "author" => descending ? booksQuery.OrderByDescending(b => b.Author) : booksQuery.OrderBy(b => b.Author),
                _ => descending ? booksQuery.OrderByDescending(b => b.Title) : booksQuery.OrderBy(b => b.Title),
            };

           
            var books = await booksQuery.ToListAsync();

           
            return Ok(books);
        }


    }
}
