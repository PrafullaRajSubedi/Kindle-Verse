using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CourseWork.Data;
using CourseWork.Model.Entity;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace CourseWork.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookFilterController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BookFilterController(ApplicationDbContext context)
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
                query = query.Where(b => (b.OriginalPrice - (b.Discount ?? 0)) >= minPrice.Value);

            if (maxPrice.HasValue)
                query = query.Where(b => (b.OriginalPrice - (b.Discount ?? 0)) <= maxPrice.Value);

            // Sorting logic
            if (!string.IsNullOrWhiteSpace(sortBy))
            {
                bool isDesc = sortOrder?.ToLower() == "desc";

                query = sortBy.ToLower() switch
                {
                    "title" => isDesc ? query.OrderByDescending(b => b.Title) : query.OrderBy(b => b.Title),
                    "publicationdate" => isDesc ? query.OrderByDescending(b => b.PublicationDate) : query.OrderBy(b => b.PublicationDate),
                    "price" => isDesc
                        ? query.OrderByDescending(b => b.OriginalPrice - (b.Discount ?? 0))
                        : query.OrderBy(b => b.OriginalPrice - (b.Discount ?? 0)),
                    "popularity" => isDesc ? query.OrderByDescending(b => b.Stock) : query.OrderBy(b => b.Stock), // Placeholder for actual popularity
                    _ => query
                };
            }

            var result = await query.ToListAsync();
            return Ok(result);
        }
    }
}
