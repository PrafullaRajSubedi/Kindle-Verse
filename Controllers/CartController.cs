using Microsoft.AspNetCore.Mvc;
using CourseWork.Model.Entity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CourseWork.Data;

namespace CourseWork.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public CartController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        [HttpPost("add-to-cart")]
        public async Task<IActionResult> AddToCart(string userId, int bookId, int quantity)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(userId))
                    return BadRequest("Valid User ID is required.");

                if (quantity <= 0)
                    return BadRequest("Quantity must be greater than zero.");

                var book = await _dbContext.Books.FindAsync(bookId);
                if (book == null)
                    return NotFound("Book not found.");

                var cart = await _dbContext.Carts
                    .Include(c => c.CartItems)
                    .FirstOrDefaultAsync(c => c.UserId == userId);

                if (cart == null)
                {
                    cart = new Cart
                    {
                        UserId = userId,
                        CartItems = new List<CartItem>()
                    };
                    _dbContext.Carts.Add(cart);
                    await _dbContext.SaveChangesAsync();
                }

                var existingItem = cart.CartItems.FirstOrDefault(ci => ci.BookId == bookId);
                if (existingItem != null)
                {
                    existingItem.Quantity += quantity;
                }
                else
                {
                    var cartItem = new CartItem
                    {
                        CartId = cart.Id,
                        BookId = bookId,
                        Quantity = quantity
                    };
                    cart.CartItems.Add(cartItem);
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

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetCart(string userId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(userId))
                    return BadRequest("Valid User ID is required.");

                var cart = await _dbContext.Carts
                    .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Book)
                    .FirstOrDefaultAsync(c => c.UserId == userId);

                if (cart == null)
                    return NotFound($"Cart not found for user ID: {userId}");

                return Ok(cart);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{userId}/items/{bookId}")]
        public async Task<IActionResult> RemoveFromCart(string userId, int bookId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(userId))
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
        public async Task<IActionResult> UpdateCartItem(string userId, int bookId, [FromBody] UpdateCartItemRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(userId))
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