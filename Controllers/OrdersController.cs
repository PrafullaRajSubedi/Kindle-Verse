using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Kindle_Verse.Database;
using Kindle_Verse.Database.Entities;
using Kindle_Verse.Models;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using System.Net.Mail;
using System.Net;
using Kindle_Verse.Service;

namespace Kindle_Verse.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMemoryCache _memoryCache;
        private readonly EmailSettings _emailSettings;
        private readonly ILogger<OrdersController> _logger;
        private readonly PromoService _promoService;

        public OrdersController(AppDbContext context, IMemoryCache memoryCache, IOptions<EmailSettings> emailSettings, ILogger<OrdersController> logger, PromoService promoService)
        {
            _context = context;
            _memoryCache = memoryCache;
            _emailSettings = emailSettings.Value;
            _logger = logger;
            _promoService = promoService;
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

        private string GenerateOTP()
        {
            using var rng = new System.Security.Cryptography.RNGCryptoServiceProvider();
            byte[] buffer = new byte[4];
            rng.GetBytes(buffer);
            int otp = Math.Abs(BitConverter.ToInt32(buffer, 0)) % 1000000;
            return otp.ToString("D6");
        }

        private void SendEmail(string email, string subject, string body)
        {
            var message = new MailMessage
            {
                From = new MailAddress(_emailSettings.FromEmail),
                Subject = subject,
                Body = body,
                IsBodyHtml = false
            };

            message.To.Add(email);

            var smtpClient = new SmtpClient(_emailSettings.SmtpServer)
            {
                Port = _emailSettings.Port,
                Credentials = new NetworkCredential(_emailSettings.Username, _emailSettings.Password),
                EnableSsl = true
            };

            smtpClient.Send(message);
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

            // Apply promo 
            decimal discountRate = 0;
            PromoCode? appliedPromo = null;

            // Check for promo code
            if (!string.IsNullOrEmpty(orderDto.PromoCode))
            {
                appliedPromo = await _context.PromoCodes
                    .FirstOrDefaultAsync(p => p.Code == orderDto.PromoCode && p.UserId == userId && !p.IsUsed);

                if (appliedPromo != null)
                {
                    discountRate = appliedPromo.DiscountRate;
                }
            }

            // Check for volume discount (5 or more books)
            int totalBooks = orderDto.OrderItems.Sum(i => i.Quantity);
            if (totalBooks >= 5)
            {
                discountRate += 0.05m; // Add 5% more
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
                TotalAmount = 0
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

            order.TotalAmount = totalAmount - (totalAmount * discountRate);
            order.OrderItems = orderItems;

            // Generate OTP
            string otp = GenerateOTP();

            order.Otp = otp;

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            if (appliedPromo != null)
            {
                appliedPromo.IsUsed = true;
                await _context.SaveChangesAsync();
            }


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
                }).ToList(),

                Otp = otp,
            };


            // Email body
            string subject = "Your Order OTP";
            string body = $"Hi {user.FirstName},\n\nYour order has been placed successfully!\nYour OTP for order confirmation is: {otp}\n\nRegards,\nKindle Verse Team";

            // Send OTP email
            try
            {
                SendEmail(user.Email, subject, body);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send OTP email to user {Email}", user.Email);
                // Do not fail order creation if email fails
            }

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

            // Validate the status value (you could use an enum for more strict validation)
            var validStatuses = new[] { "Pending", "Processing", "Shipped", "Completed", "Cancelled" };
            if (!validStatuses.Contains(statusDto.Status))
            {
                return BadRequest(new { Message = "Invalid status value. Allowed values are: " + string.Join(", ", validStatuses) });
            }

            order.Status = statusDto.Status;
            await _context.SaveChangesAsync();

            // Send email if completed
            if (statusDto.Status == "Completed")
            {
                var user = await _context.Users.FindAsync(order.UserId);
                if (user != null)
                {
                    string subject = "Your Order Has Been Completed";
                    string body = $"Hi {user.FirstName},\n\nYour order with ID #{order.Id} has been completed.\n\nThank you for shopping with us!\n\nKindle Verse Team";

                    try
                    {
                        SendEmail(user.Email, subject, body);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Failed to send delivery email for order {OrderId}", order.Id);
                        // Don't fail the update if email fails
                    }

                    await _promoService.GeneratePromoIfEligible((int)order.UserId);

                }
            }

            return NoContent();
        }

        [HttpGet("{orderNumber}/otp")]
        public IActionResult GetOrderOtp(string orderNumber)
        {
            var otp = _memoryCache.Get<string>($"ORDER_OTP_{orderNumber}");
            if (otp == null)
                return NotFound("OTP expired or not found.");
            return Ok(new { otp });
        }


        [HttpGet("staff")]
        public async Task<IActionResult> GetOrdersForStaff()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .Include(o => o.User)
                .Select(o => new
                {
                    o.Id,
                    o.UserId,
                    UserName = o.User != null ? $"{o.User.FirstName} {o.User.LastName}" : string.Empty,
                    o.OrderNumber,
                    o.OrderDate,
                    o.Status,
                    o.Otp,
                    o.TotalAmount, 
                    Items = o.OrderItems.Select(i => new
                    {
                        i.ProductName,
                        i.Quantity,
                        i.Price,
                        Subtotal = i.Quantity * i.Price  // Adding subtotal for each item
                    }).ToList()
                })
                .ToListAsync();

            return Ok(orders);
        }


    }
}