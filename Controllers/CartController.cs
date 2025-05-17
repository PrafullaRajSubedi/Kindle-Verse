using Microsoft.AspNetCore.Mvc;
using Kindle_Verse.Database.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Kindle_Verse.Database;
using Kindle_Verse.Models;

namespace CourseWork.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public CartController(AppDbContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        [HttpPost("add-to-cart")]
        public async Task<IActionResult> AddToCart(int userId, int bookId, int quantity)
        {
            try
            {
                if (userId <= 0)
                    return BadRequest("Valid User ID is required.");

                if (quantity <= 0)
                    return BadRequest("Quantity must be greater than zero.");

                var cart = await _dbContext.Carts
            .Include(c => c.CartItems)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
        {
            cart = new Cart { UserId = userId };
            _dbContext.Carts.Add(cart);
            await _dbContext.SaveChangesAsync(); // Save so we get cart.Id
        }

        // Check if book exists
        var book = await _dbContext.Books.FindAsync(bookId);
        if (book == null) return NotFound("Book not found");

        // Check if item already exists in cart
        var existingItem = cart.CartItems.FirstOrDefault(ci => ci.BookId == bookId);
        if (existingItem != null)
        {
            existingItem.Quantity += quantity;
        }
        else
        {
            cart.CartItems.Add(new CartItem
            {
                BookId = bookId,
                Quantity = quantity
            });
        }

        await _dbContext.SaveChangesAsync();
        return Ok("Item added to cart");
    }
    catch (Exception ex)
    {
        return StatusCode(500, ex.InnerException?.Message ?? ex.Message);
    }
}

        [HttpGet("{userId}")]
public async Task<IActionResult> GetCart(int userId)
{
    try
    {
        if (userId <= 0)
            return BadRequest("Valid User ID is required.");

        var cart = await _dbContext.Carts
            .Include(c => c.CartItems)
            .ThenInclude(ci => ci.Book)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
            return NotFound($"Cart not found for user ID: {userId}");

        var dto = new CartDto
        {
            Id = cart.Id,
            UserId = cart.UserId,
            CartItems = cart.CartItems.Select(ci => new CartItemDto
            {
                Id = ci.Id,
                Quantity = ci.Quantity,
                BookId = ci.BookId,
                Title = ci.Book.Title,
                Author = ci.Book.Author,
                Price = ci.Book.Price,
                CoverImagePath = ci.Book.CoverImagePath,
                IsOnSale = ci.Book.IsOnSale
            }).ToList()
        };

        return Ok(dto);
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"Internal server error: {ex.Message}");
    }
}


        [HttpDelete("{userId}/items/{bookId}")]
        public async Task<IActionResult> RemoveFromCart(int userId, int bookId)
        {
            try
            {
                if (userId <= 0)
                    return BadRequest("Valid User ID is required.");

                var cart = await _dbContext.Carts
                    .Include(c => c.CartItems)
                    .FirstOrDefaultAsync(c => c.UserId == userId);

                if (cart == null)
                    return NotFound($"Cart not found for user ID: {userId}");

                var item = cart.CartItems.FirstOrDefault(ci => ci.BookId == bookId);
                if (item == null)
                    return NotFound($"Book ID {bookId} not found in cart.");

                _dbContext.CartItems.Remove(item);
                await _dbContext.SaveChangesAsync();

                return Ok(new { message = "Item removed successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{userId}/items/{bookId}")]
        public async Task<IActionResult> UpdateCartItem(int userId, int bookId, [FromBody] UpdateCartItemRequest request)
        {
            try
            {
                if (userId <= 0)
                    return BadRequest("Valid User ID is required.");

                if (request == null || request.Quantity < 0)
                    return BadRequest("Valid quantity is required.");

                var cart = await _dbContext.Carts
                    .Include(c => c.CartItems)
                    .FirstOrDefaultAsync(c => c.UserId == userId);

                if (cart == null)
                    return NotFound($"Cart not found for user ID: {userId}");

                var item = cart.CartItems.FirstOrDefault(ci => ci.BookId == bookId);
                if (item == null)
                    return NotFound($"Book ID {bookId} not found in cart.");

                if (request.Quantity == 0)
                {
                    _dbContext.CartItems.Remove(item);
                }
                else
                {
                    item.Quantity = request.Quantity;
                }

                await _dbContext.SaveChangesAsync();

                var updatedCart = await _dbContext.Carts
                    .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Book)
                    .FirstOrDefaultAsync(c => c.Id == cart.Id);

                return Ok(updatedCart);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }

    public class UpdateCartItemRequest
    {
        public int Quantity { get; set; }
    }
}
