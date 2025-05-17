using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Kindle_Verse.Database;
using Kindle_Verse.Database.Entities;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace CourseWork.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookFilterController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BookFilterController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("list")]
        public async Task<IActionResult> GetFilteredBooks(
            string? search,
            string? author,
            string? genre,
            string? language,
            string? format,
            string? publisher,
            bool? inStock,
            decimal? minPrice,
            decimal? maxPrice,
            string? sortBy,
            string? sortOrder = "asc"
        )
        {
            var query = _context.Books.AsQueryable();

            // Keyword search in title, ISBN, or description
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(b =>
                    b.Title.Contains(search) ||
                    b.ISBN.Contains(search) ||
                    b.Description.Contains(search));
            }

            // Filter conditions
            if (!string.IsNullOrWhiteSpace(author))
                query = query.Where(b => b.Author == author);

            if (!string.IsNullOrWhiteSpace(genre))
                query = query.Where(b => b.Genre == genre);

            if (!string.IsNullOrWhiteSpace(language))
                query = query.Where(b => b.Language == language);

            if (!string.IsNullOrWhiteSpace(format))
                query = query.Where(b => b.Format == format);

            if (!string.IsNullOrWhiteSpace(publisher))
                query = query.Where(b => b.Publisher == publisher);

            if (inStock == true)
                query = query.Where(b => b.Stock > 0);

            if (minPrice.HasValue)
                query = query.Where(b => (b.Price - (b.Discount ?? 0)) >= minPrice.Value);

            if (maxPrice.HasValue)
                query = query.Where(b => (b.Price - (b.Discount ?? 0)) <= maxPrice.Value);

            // Sorting logic
            if (!string.IsNullOrWhiteSpace(sortBy))
            {
                bool isDesc = sortOrder?.ToLower() == "desc";

                query = sortBy.ToLower() switch
                {
                    "title" => isDesc ? query.OrderByDescending(b => b.Title) : query.OrderBy(b => b.Title),
                    "publicationdate" => isDesc ? query.OrderByDescending(b => b.PublicationDate) : query.OrderBy(b => b.PublicationDate),
                    "price" => isDesc
                        ? query.OrderByDescending(b => b.Price - (b.Discount ?? 0))
                        : query.OrderBy(b => b.Price - (b.Discount ?? 0)),
                    "popularity" => isDesc ? query.OrderByDescending(b => b.Stock) : query.OrderBy(b => b.Stock), // Placeholder for actual popularity
                    _ => query
                };
            }

            var result = await query.ToListAsync();
            return Ok(result);
        }

        [HttpGet("authors")]
        public async Task<IActionResult> GetAuthors()
        {
            var authors = await _context.Books
                .Select(b => b.Author)
                .Distinct()
                .ToListAsync();
            return Ok(authors);
        }

        [HttpGet("genres")]
        public async Task<IActionResult> GetGenres()
        {
            var genres = await _context.Books
                .Select(b => b.Genre)
                .Distinct()
                .ToListAsync();
            return Ok(genres);
        }

        [HttpGet("languages")]
        public async Task<IActionResult> GetLanguages()
        {
            var languages = await _context.Books
                .Select(b => b.Language)
                .Distinct()
                .ToListAsync();
            return Ok(languages);
        }

        [HttpGet("formats")]
        public async Task<IActionResult> GetFormats()
        {
            var formats = await _context.Books
                .Select(b => b.Format)
                .Distinct()
                .ToListAsync();
            return Ok(formats);
        }

        [HttpGet("publishers")]
        public async Task<IActionResult> GetPublishers()
        {
            var publishers = await _context.Books
                .Select(b => b.Publisher)
                .Distinct()
                .ToListAsync();
            return Ok(publishers);
        }
    }
}