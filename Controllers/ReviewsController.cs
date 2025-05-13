using Kindle_Verse.Database;
using Kindle_Verse.Database.Entities;
using Kindle_Verse.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Kindle_Verse.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ReviewsController> _logger;

        public ReviewsController(AppDbContext context, ILogger<ReviewsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // POST: api/Reviews
        // Create a new review for an order
        [HttpPost]
        public async Task<IActionResult> CreateReview([FromQuery] int userId, [FromBody] CreateReviewDto createDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Check if user exists
                var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
                if (!userExists)
                {
                    return NotFound(new { Message = "User not found." });
                }

                // Check if order exists
                var order = await _context.Orders
                    .Include(o => o.Reviews)
                    .FirstOrDefaultAsync(o => o.Id == createDto.OrderId);

                if (order == null)
                {
                    return NotFound(new { Message = "Order not found." });
                }

                // Check if order belongs to the user
                if (order.UserId != userId)
                {
                    return Forbid();
                }

                // Check if the user has already reviewed this order
                if (order.Reviews != null && order.Reviews.Any(r => r.UserId == userId))
                {
                    return Conflict(new { Message = "You have already reviewed this order." });
                }

                // Create the review
                var review = new Review
                {
                    UserId = userId,
                    OrderId = createDto.OrderId,
                    Rating = createDto.Rating,
                    Comment = createDto.Comment,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Reviews.Add(review);
                await _context.SaveChangesAsync();

                // Return the created review
                var reviewDto = new ReviewDto
                {
                    Id = review.Id,
                    UserId = review.UserId,
                    OrderId = review.OrderId,
                    Rating = review.Rating,
                    Comment = review.Comment,
                    CreatedAt = review.CreatedAt
                };

                return CreatedAtAction(nameof(GetReview), new { id = review.Id }, reviewDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating review for order ID {OrderId}", createDto.OrderId);
                return StatusCode(500, new { Message = "An error occurred while creating the review." });
            }
        }

        // GET: api/Reviews/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetReview(int id)
        {
            try
            {
                var review = await _context.Reviews
                    .Include(r => r.User)
                    .FirstOrDefaultAsync(r => r.Id == id);

                if (review == null)
                {
                    return NotFound(new { Message = "Review not found." });
                }

                var reviewDto = new ReviewDto
                {
                    Id = review.Id,
                    UserId = review.UserId,
                    OrderId = review.OrderId,
                    Rating = review.Rating,
                    Comment = review.Comment,
                    CreatedAt = review.CreatedAt,
                    UpdatedAt = review.UpdatedAt,
                    UserName = review.User != null ? $"{review.User.FirstName} {review.User.LastName}" : null
                };

                return Ok(reviewDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving review with ID {ReviewId}", id);
                return StatusCode(500, new { Message = "An error occurred while retrieving the review." });
            }
        }

        // GET: api/Reviews/order/{orderId}
        [HttpGet("order/{orderId}")]
        public async Task<IActionResult> GetOrderReviews(int orderId)
        {
            try
            {
                // Check if order exists
                var orderExists = await _context.Orders.AnyAsync(o => o.Id == orderId);
                if (!orderExists)
                {
                    return NotFound(new { Message = "Order not found." });
                }

                var reviews = await _context.Reviews
                    .Where(r => r.OrderId == orderId)
                    .Include(r => r.User)
                    .Select(r => new ReviewDto
                    {
                        Id = r.Id,
                        UserId = r.UserId,
                        OrderId = r.OrderId,
                        Rating = r.Rating,
                        Comment = r.Comment,
                        CreatedAt = r.CreatedAt,
                        UpdatedAt = r.UpdatedAt,
                        UserName = r.User != null ? $"{r.User.FirstName} {r.User.LastName}" : null
                    })
                    .ToListAsync();

                return Ok(reviews);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving reviews for order ID {OrderId}", orderId);
                return StatusCode(500, new { Message = "An error occurred while retrieving the reviews." });
            }
        }

        // GET: api/Reviews/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserReviews(int userId)
        {
            try
            {
                // Check if user exists
                var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
                if (!userExists)
                {
                    return NotFound(new { Message = "User not found." });
                }

                var reviews = await _context.Reviews
                    .Where(r => r.UserId == userId)
                    .Include(r => r.Order)
                    .Select(r => new ReviewDto
                    {
                        Id = r.Id,
                        UserId = r.UserId,
                        OrderId = r.OrderId,
                        Rating = r.Rating,
                        Comment = r.Comment,
                        CreatedAt = r.CreatedAt,
                        UpdatedAt = r.UpdatedAt
                    })
                    .ToListAsync();

                return Ok(reviews);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving reviews for user ID {UserId}", userId);
                return StatusCode(500, new { Message = "An error occurred while retrieving the reviews." });
            }
        }

        // PUT: api/Reviews/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReview(int id, [FromQuery] int userId, [FromBody] UpdateReviewDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var review = await _context.Reviews.FindAsync(id);
                if (review == null)
                {
                    return NotFound(new { Message = "Review not found." });
                }

                // Verify the review belongs to the user
                if (review.UserId != userId)
                {
                    return Forbid();
                }

                // Update the review
                review.Rating = updateDto.Rating;
                review.Comment = updateDto.Comment;
                review.UpdatedAt = DateTime.UtcNow;

                _context.Entry(review).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                // Return the updated review
                var reviewDto = new ReviewDto
                {
                    Id = review.Id,
                    UserId = review.UserId,
                    OrderId = review.OrderId,
                    Rating = review.Rating,
                    Comment = review.Comment,
                    CreatedAt = review.CreatedAt,
                    UpdatedAt = review.UpdatedAt
                };

                return Ok(reviewDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating review with ID {ReviewId}", id);
                return StatusCode(500, new { Message = "An error occurred while updating the review." });
            }
        }

        // DELETE: api/Reviews/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(int id, [FromQuery] int userId)
        {
            try
            {
                var review = await _context.Reviews.FindAsync(id);
                if (review == null)
                {
                    return NotFound(new { Message = "Review not found." });
                }

                // Verify the review belongs to the user
                if (review.UserId != userId)
                {
                    return Forbid();
                }

                _context.Reviews.Remove(review);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting review with ID {ReviewId}", id);
                return StatusCode(500, new { Message = "An error occurred while deleting the review." });
            }
        }
    }
}