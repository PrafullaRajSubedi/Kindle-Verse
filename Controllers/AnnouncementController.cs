using Microsoft.AspNetCore.Mvc;
using Kindle_Verse.Database;
using Kindle_Verse.Database.Entities;
using Kindle_Verse.Models;

namespace Kindle_Verse.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnnouncementController : ControllerBase
    {
        private readonly AppDbContext _db;

        public AnnouncementController(AppDbContext db)
        {
            _db = db;
        }

        [HttpPost("create")]
        public IActionResult CreateAnnouncement(CreateAnnouncementDto dto)
        {
            Announcement announcement = new()
            {
                Title = dto.Title,
                Message = dto.Message,
                StartDate = dto.StartDate.ToUniversalTime(),
                EndDate = dto.EndDate.ToUniversalTime(),
                CreatedAt = DateTime.UtcNow
            };

            _db.Announcements.Add(announcement);
            _db.SaveChanges();

            return Ok(new { message = "Announcement created", id = announcement.Id });
        }

        [HttpGet("get-active")]
        public IActionResult GetActiveAnnouncements()
        {
            var now = DateTime.UtcNow;
            var result = _db.Announcements
                .Where(a => a.StartDate <= now && a.EndDate >= now)
                .Select(a => new AnnouncementDto
                {
                    Id = a.Id,
                    Title = a.Title,
                    Message = a.Message,
                    StartDate = a.StartDate,
                    EndDate = a.EndDate,
                    CreatedAt = a.CreatedAt
                })
                .ToList();

            return Ok(result);
        }

        [HttpDelete("delete/{id}")]
        public IActionResult DeleteAnnouncement(int id)
        {
            var announcement = _db.Announcements.Find(id);
            if (announcement == null) return NotFound("Announcement not found");

            _db.Announcements.Remove(announcement);
            _db.SaveChanges();

            return Ok("Announcement deleted");
        }
    }
}