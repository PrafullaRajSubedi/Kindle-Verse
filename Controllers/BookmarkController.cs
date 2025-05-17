using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Kindle_Verse.Database;
using Kindle_Verse.Database.Entities;
using System.Security.Claims;

namespace Kindle_Verse.Controllers
{
    [ApiController]
    [Route("api/bookmarks")]
    [Authorize] // Ensure user is logged in
    public class BookmarkController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BookmarkController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("{bookId}")]
        public async Task<IActionResult> AddToBookmark(int bookId)
        {
            var userId = long.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var alreadyBookmarked = await _context.Bookmarks
                .AnyAsync(b => b.UserId == userId && b.BookId == bookId);

            if (alreadyBookmarked)
                return BadRequest("Book already bookmarked.");

            _context.Bookmarks.Add(new Bookmark
            {
                UserId = userId,
                BookId = bookId
            });

            await _context.SaveChangesAsync();
            return Ok(new { message = "Book bookmarked successfully." });
        }

        [HttpGet]
        public async Task<IActionResult> GetBookmarks()
        {
            var userId = long.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var bookmarks = await _context.Bookmarks
                .Include(b => b.Book)
                .Where(b => b.UserId == userId)
                .Select(b => new
                {
                    b.Book.Id,
                    b.Book.Title,
                    b.Book.Author,
                    b.Book.CoverImagePath,
                    b.Book.Genre,
                    b.Book.Description,
                    b.Book.Price
                })
                .ToListAsync();

            return Ok(bookmarks);
        }

        [HttpDelete("{bookId}")]
        public async Task<IActionResult> RemoveFromBookmark(int bookId)
        {
            var userId = long.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var bookmark = await _context.Bookmarks
                .FirstOrDefaultAsync(b => b.UserId == userId && b.BookId == bookId);

            if (bookmark == null)
                return NotFound("Bookmark not found.");

            _context.Bookmarks.Remove(bookmark);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Book removed from bookmark." });
        }
    }
}
