using Microsoft.AspNetCore.Mvc;
using Kindle_Verse.Database;
using Kindle_Verse.Database.Entities;
using Microsoft.EntityFrameworkCore;
using Kindle_Verse.Models;

namespace Kindle_Verse.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UpdateProfileController : ControllerBase // Fixed naming convention (Pascal case)
    {
        private readonly AppDbContext _context;

        public UpdateProfileController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProfile(int id)
        {
            var profile = await _context.UpdateProfiles.FindAsync(id);
            if (profile == null)
            {
                return NotFound();
            }
            return Ok(profile);
        }

        // Add missing CRUD operations
        [HttpPost]
        public async Task<IActionResult> CreateProfile(UpdatedProfileDto profileDto)
        {
            var profile = new UpdateProfile
            {
                FullName = profileDto.FullName,
                Email = profileDto.Email,
                BookPurchased = profileDto.BookPurchased
            };

            _context.UpdateProfiles.Add(profile);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProfile), new { id = profile.Id }, profile);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProfile(int id, UpdatedProfileDto profileDto)
        {
            var profile = await _context.UpdateProfiles.FindAsync(id);
            if (profile == null)
            {
                return NotFound();
            }

            profile.FullName = profileDto.FullName;
            profile.Email = profileDto.Email;
            profile.BookPurchased = profileDto.BookPurchased;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProfile(int id)
        {
            var profile = await _context.UpdateProfiles.FindAsync(id);
            if (profile == null)
            {
                return NotFound();
            }

            _context.UpdateProfiles.Remove(profile);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}