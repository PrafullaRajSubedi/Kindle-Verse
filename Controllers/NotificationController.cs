using Microsoft.AspNetCore.Mvc;
using Kindle_Verse.Database;
using Kindle_Verse.Models;
using Kindle_Verse.Database.Entities;

namespace Kindle_Verse.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly AppDbContext _db;

        public NotificationController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet("user/{userId}")]
        public IActionResult GetUserNotifications(long userId)
        {
            var notifications = _db.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new NotificationDto
                {
                    Id = n.Id,
                    Message = n.Message,
                    IsRead = n.IsRead,
                    CreatedAt = n.CreatedAt
                })
                .ToList();

            return Ok(notifications);
        }
    }
}