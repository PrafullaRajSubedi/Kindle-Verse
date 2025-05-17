using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Kindle_Verse.Database;
using Kindle_Verse.Database.Entities;
using Kindle_Verse.Models;

namespace Kindle_Verse.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Orders/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetUserOrders(long userId)
        {
            var orders = await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.OrderItems)
                .Include(o => o.User)
                .ToListAsync();

            var orderDtos = orders.Select(o => new OrderDto
            {
                Id = o.Id,
                OrderNumber = o.OrderNumber,
                OrderDate = o.OrderDate,
                TotalAmount = o.TotalAmount,
                Status = o.Status,
                UserId = o.UserId,
                UserName = o.User != null ? $"{o.User.FirstName} {o.User.LastName}" : string.Empty,
                OrderItems = o.OrderItems?.Select(i => new OrderItemDto
                {
                    Id = i.Id,
                    ProductName = i.ProductName,
                    Quantity = i.Quantity,
                    Price = i.Price,
                    OrderId = i.OrderId
                }).ToList() ?? new List<OrderItemDto>()
            }).ToList();

            return Ok(orderDtos);
        }

        // GET: api/Orders/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .Include(o => o.User)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound(new { Message = "Order not found." });
            }

            var orderDto = new OrderDto
            {
                Id = order.Id,
                OrderNumber = order.OrderNumber,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                UserId = order.UserId,
                UserName = order.User != null ? $"{order.User.FirstName} {order.User.LastName}" : string.Empty,
                OrderItems = order.OrderItems?.Select(i => new OrderItemDto
                {
                    Id = i.Id,
                    ProductName = i.ProductName,
                    Quantity = i.Quantity,
                    Price = i.Price,
                    OrderId = i.OrderId
                }).ToList() ?? new List<OrderItemDto>()
            };

            return Ok(orderDto);
        }

        // POST: api/Orders?userId={userId}
        [HttpPost]
        public async Task<ActionResult<OrderDto>> CreateOrder([FromQuery] long userId, [FromBody] CreateOrderDto orderDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Validate user exists
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return BadRequest(new { Message = "User not found." });
            }

            // Make sure order contains items
            if (orderDto.OrderItems == null || !orderDto.OrderItems.Any())
            {
                return BadRequest(new { Message = "Order must contain at least one item." });
            }

            // Additional validation for each order item
            foreach (var item in orderDto.OrderItems)
            {
                // Add more restrictive validation than what's in the DTO attributes
                if (string.IsNullOrWhiteSpace(item.ProductName))
                {
                    return BadRequest(new { Message = "Product name is required." });
                }

                // Limit quantity to a reasonable range (1-1000)
                if (item.Quantity <= 0 || item.Quantity > 1000)
                {
                    return BadRequest(new { Message = "Quantity must be between 1 and 1000." });
                }

                // Limit price to a reasonable range (0.01-10000)
                if (item.Price <= 0 || item.Price > 10000)
                {
                    return BadRequest(new { Message = "Price must be between 0.01 and 10000." });
                }
            }

            // Generate order number
            string orderNumber = $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..8].ToUpper()}";

            // Create the order
            var order = new Order
            {
                UserId = userId,
                OrderNumber = orderNumber,
                OrderDate = DateTime.UtcNow,
                Status = "Pending",
                TotalAmount = 0 // Will calculate below
            };

            // Create order items and calculate total amount
            var orderItems = new List<OrderItem>();
            decimal totalAmount = 0;

            foreach (var itemDto in orderDto.OrderItems)
            {
                var orderItem = new OrderItem
                {
                    ProductName = itemDto.ProductName,
                    Quantity = itemDto.Quantity,
                    Price = itemDto.Price,
                };
                orderItems.Add(orderItem);

                // Calculate item subtotal with overflow protection
                decimal itemTotal;
                try
                {
                    checked
                    {
                        itemTotal = itemDto.Quantity * itemDto.Price;
                        totalAmount += itemTotal;
                    }
                }
                catch (OverflowException)
                {
                    return BadRequest(new { Message = "Order calculation resulted in an overflow. Please check your quantities and prices." });
                }
            }

            order.TotalAmount = totalAmount;
            order.OrderItems = orderItems;

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Create response DTO
            var responseDto = new OrderDto
            {
                Id = order.Id,
                OrderNumber = order.OrderNumber,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                UserId = order.UserId,
                UserName = $"{user.FirstName} {user.LastName}",
                OrderItems = orderItems.Select(i => new OrderItemDto
                {
                    Id = i.Id,
                    ProductName = i.ProductName,
                    Quantity = i.Quantity,
                    Price = i.Price,
                    OrderId = i.OrderId
                }).ToList()
            };

            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, responseDto);
        }

        // DELETE: api/Orders/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound(new { Message = "Order not found." });
            }

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/Orders/{id}/status?userId={userId}
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromQuery] long userId, [FromBody] UpdateOrderStatusDto statusDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound(new { Message = "Order not found." });
            }

            // Verify the user owns this order or is an admin (you might want to add role checks)
            if (order.UserId != userId)
            {
                return Forbid();
            }

            // Validate the status value (you could use an enum for more strict validation)
            var validStatuses = new[] { "Pending", "Processing", "Shipped", "Delivered", "Cancelled" };
            if (!validStatuses.Contains(statusDto.Status))
            {
                return BadRequest(new { Message = "Invalid status value. Allowed values are: " + string.Join(", ", validStatuses) });
            }

            order.Status = statusDto.Status;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}