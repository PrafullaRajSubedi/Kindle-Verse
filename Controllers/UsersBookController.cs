using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Kindle_Verse.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Kindle_Verse.Controllers
{
    [ApiController]
    [Route("api/user-books")]
    public class UsersBookController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersBookController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/user-books
        [HttpGet]
        public async Task<IActionResult> GetAllBooks()
        {
            var now = DateTime.UtcNow;

            var books = await _context.Books
                .Where(b => b.Stock > 0)
                .Select(b => new
                {
                    b.Id,
                    b.Title,
                    b.Author,
                    b.CoverImagePath,
                    OriginalPrice = b.Price,
                    IsOnSale = b.IsOnSale &&
                               b.DiscountStartDate <= now &&
                               b.DiscountEndDate >= now,
                    SalePrice = (b.IsOnSale &&
                                 b.DiscountStartDate <= now &&
                                 b.DiscountEndDate >= now)
                                ? b.Price - b.Discount
                                : b.Price,
                    b.Genre
                })
                .ToListAsync();

            return Ok(books);
        }
    }
}
