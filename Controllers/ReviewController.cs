using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CourseWork.Model.Entity;
using CourseWork.Data;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace CourseWork.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReviewController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddReview(int userId, int bookId, int rating, string comment)
        {
            try
            {
                if (userId <= 0)
                    return BadRequest("User ID is required.");

                if (rating < 1 || rating > 5)
                    return BadRequest("Rating must be between 1 and 5.");

                var userExists = await _context.Users.AnyAsync(u => u.UserId == userId);
                if (!userExists)
                    return NotFound("User not found.");

                var bookExists = await _context.Books.AnyAsync(b => b.Id == bookId);
                if (!bookExists)
                    return NotFound("Book not found.");

                var hasPurchased = await _context.Purchases
                    .AnyAsync(p => p.UserId == userId && p.BookId == bookId);

                if (!hasPurchased)
                    return BadRequest("Only users who purchased the book can leave a review.");

                var existingReview = await _context.Reviews
                    .FirstOrDefaultAsync(r => r.UserId == userId && r.BookId == bookId);

                if (existingReview != null)
                {
                    existingReview.Rating = rating;
                    existingReview.Comment = comment;
                    existingReview.CreatedAt = DateTime.UtcNow;

                    await _context.SaveChangesAsync();
                    return Ok(existingReview);
                }

                var review = new Review
                {
                    UserId = userId,
                    BookId = bookId,
                    Rating = rating,
                    Comment = comment,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Reviews.Add(review);
                await _context.SaveChangesAsync();

                return Ok(review);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("book/{bookId}")]
        public async Task<IActionResult> GetReviews(int bookId)
        {
            try
            {
                var bookExists = await _context.Books.AnyAsync(b => b.Id == bookId);
                if (!bookExists)
                    return NotFound("Book not found.");

                var reviews = await _context.Reviews
                    .Where(r => r.BookId == bookId)
                    .Include(r => r.User)
                    .OrderByDescending(r => r.CreatedAt)
                    .ToListAsync();

                return Ok(reviews);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}