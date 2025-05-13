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
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<OrdersController> _logger;

        public OrdersController(AppDbContext context, ILogger<OrdersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Orders/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserOrders(int userId)
        {
            try
            {
                // Check if user exists
                var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
                if (!userExists)
                {
                    return NotFound(new { Message = "User not found." });
                }

                // Get all orders for the user including order items
                var orders = await _context.Orders
                    .Where(o => o.UserId == userId)
                    .Include(o => o.OrderItems)
                    .Include(o => o.User)
                    .OrderByDescending(o => o.OrderDate)
                    .Select(o => new OrderDto
                    {
                        Id = o.Id,
                        OrderNumber = o.OrderNumber,
                        OrderDate = o.OrderDate,
                        TotalAmount = o.TotalAmount,
                        Status = o.Status,
                        UserId = o.UserId,
                        UserName = o.User != null ? $"{o.User.FirstName} {o.User.LastName}" : null,
                        OrderItems = o.OrderItems != null ? o.OrderItems.Select(oi => new OrderItemDto
                        {
                            Id = oi.Id,
                            ProductName = oi.ProductName,
                            Quantity = oi.Quantity,
                            Price = oi.Price,
                            OrderId = oi.OrderId
                        }).ToList() : new List<OrderItemDto>()
                    })
                    .ToListAsync();

                return Ok(orders);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving orders for user ID {UserId}", userId);
                return StatusCode(500, new { Message = "An error occurred while retrieving orders." });
            }
        }

        // GET: api/Orders/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrder(int id)
        {
            try
            {
                var order = await _context.Orders
                    .Include(o => o.OrderItems)
                    .Include(o => o.User)
                    .FirstOrDefaultAsync(o => o.Id == id);

                if (order == null)
                {
                    return NotFound(new { Message = "Order not found." });
                }

                // Map to DTO
                var orderDto = new OrderDto
                {
                    Id = order.Id,
                    OrderNumber = order.OrderNumber,
                    OrderDate = order.OrderDate,
                    TotalAmount = order.TotalAmount,
                    Status = order.Status,
                    UserId = order.UserId,
                    UserName = order.User != null ? $"{order.User.FirstName} {order.User.LastName}" : null,
                    OrderItems = order.OrderItems?.Select(oi => new OrderItemDto
                    {
                        Id = oi.Id,
                        ProductName = oi.ProductName,
                        Quantity = oi.Quantity,
                        Price = oi.Price,
                        OrderId = oi.OrderId
                    }).ToList() ?? new List<OrderItemDto>()
                };

                return Ok(orderDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving order with ID {OrderId}", id);
                return StatusCode(500, new { Message = "An error occurred while retrieving the order." });
            }
        }

        // POST: api/Orders
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromQuery] int userId, [FromBody] CreateOrderDto createDto)
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

                // Generate a unique order number
                var orderNumber = $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}";

                // Calculate total amount
                decimal totalAmount = createDto.OrderItems.Sum(item => item.Price * item.Quantity);

                // Create the order
                var order = new Order
                {
                    UserId = userId,
                    OrderNumber = orderNumber,
                    OrderDate = DateTime.UtcNow,
                    TotalAmount = totalAmount,
                    Status = "Pending",
                    OrderItems = createDto.OrderItems.Select(item => new OrderItem
                    {
                        ProductName = item.ProductName,
                        Quantity = item.Quantity,
                        Price = item.Price
                    }).ToList()
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                // Return the created order
                var orderDto = new OrderDto
                {
                    Id = order.Id,
                    OrderNumber = order.OrderNumber,
                    OrderDate = order.OrderDate,
                    TotalAmount = order.TotalAmount,
                    Status = order.Status,
                    UserId = order.UserId,
                    OrderItems = order.OrderItems.Select(oi => new OrderItemDto
                    {
                        Id = oi.Id,
                        ProductName = oi.ProductName,
                        Quantity = oi.Quantity,
                        Price = oi.Price,
                        OrderId = oi.OrderId
                    }).ToList()
                };

                return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, orderDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating order for user ID {UserId}", userId);
                return StatusCode(500, new { Message = "An error occurred while creating the order." });
            }
        }

        // PUT: api/Orders/{id}/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromQuery] int userId, [FromBody] UpdateOrderStatusDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var order = await _context.Orders.FindAsync(id);
                if (order == null)
                {
                    return NotFound(new { Message = "Order not found." });
                }

                // Verify the order belongs to the user
                if (order.UserId != userId)
                {
                    return Forbid();
                }

                // Update the order status
                order.Status = updateDto.Status;

                _context.Entry(order).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating status for order ID {OrderId}", id);
                return StatusCode(500, new { Message = "An error occurred while updating the order status." });
            }
        }

        // DELETE: api/Orders/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id, [FromQuery] int userId)
        {
            try
            {
                var order = await _context.Orders.FindAsync(id);
                if (order == null)
                {
                    return NotFound(new { Message = "Order not found." });
                }

                // Verify the order belongs to the user
                if (order.UserId != userId)
                {
                    return Forbid();
                }

                // Check if order is in a state that allows deletion 
                // (e.g., only allow deleting orders that are still "Pending")
                if (order.Status != "Pending")
                {
                    return BadRequest(new { Message = $"Cannot delete order with status '{order.Status}'." });
                }

                _context.Orders.Remove(order);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting order with ID {OrderId}", id);
                return StatusCode(500, new { Message = "An error occurred while deleting the order." });
            }
        }
    }
}