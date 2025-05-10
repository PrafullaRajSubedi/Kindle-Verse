using Microsoft.AspNetCore.Mvc;
using CourseWork.Database;
using CourseWork.Model.Entity;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace CourseWork.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CartController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddToCart(int userId, int bookId, int quantity)
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                cart = new Cart
                {
                    UserId = userId,
                    CartItems = new List<CartItem>()
                };
                _context.Carts.Add(cart);
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
                    BookId = bookId,
                    Quantity = quantity
                };
                cart.CartItems.Add(cartItem);
            }

            await _context.SaveChangesAsync();
            return Ok(cart);
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetCart(int userId)
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Book)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
                return NotFound("Cart not found.");

            return Ok(cart);
        }

        [HttpDelete("remove")]
        public async Task<IActionResult> RemoveFromCart(int userId, int bookId)
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null) return NotFound("Cart not found.");

            var item = cart.CartItems.FirstOrDefault(ci => ci.BookId == bookId);
            if (item == null) return NotFound("Book not found in cart.");

            cart.CartItems.Remove(item);
            await _context.SaveChangesAsync();
            return Ok("Item removed.");
        }
    }
}
