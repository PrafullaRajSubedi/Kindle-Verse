using Kindle_Verse.Database;
using Kindle_Verse.Database.Entities;
using Kindle_Verse.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace Kindle_Verse.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<UsersController> _logger;

        public UsersController(AppDbContext context, ILogger<UsersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: Get all users
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _context.Users
                    .Select(u => new
                    {
                        u.Id,
                        u.FirstName,
                        u.LastName,
                        u.Email
                    })
                    .ToListAsync();

                return Ok(users);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving users");
                return StatusCode(500, new { Message = "An error occurred while retrieving users." });
            }
        }

        // GET: Get user profile by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(long id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    return NotFound(new { Message = "User not found." });
                }

                return Ok(new
                {
                    user.Id,
                    user.FirstName,
                    user.LastName,
                    user.Email
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user with ID {UserId}", id);
                return StatusCode(500, new { Message = "An error occurred while retrieving the user." });
            }
        }

        // POST: Create new user
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto createDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Check if email already exists
                if (await _context.Users.AnyAsync(u => u.Email == createDto.Email))
                {
                    return Conflict(new { Message = "Email already registered." });
                }

                var user = new User
                {
                    FirstName = createDto.FirstName,
                    LastName = createDto.LastName,
                    Email = createDto.Email,
                    PasswordHash = HashPassword(createDto.Password),
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetUser), new { id = user.Id }, new
                {
                    user.Id,
                    user.FirstName,
                    user.LastName,
                    user.Email
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating new user");
                return StatusCode(500, new { Message = "An error occurred while creating the user." });
            }
        }

        // PUT: Update user details
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(long id, [FromBody] UpdateUserDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    return NotFound(new { Message = "User not found." });
                }

                // Update only allowed fields
                user.FirstName = updateDto.FirstName;
                user.LastName = updateDto.LastName;

                // Only update password if provided
                if (!string.IsNullOrEmpty(updateDto.Password))
                {
                    user.PasswordHash = HashPassword(updateDto.Password);
                }

                _context.Entry(user).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    user.Id,
                    user.FirstName,
                    user.LastName,
                    user.Email
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user with ID {UserId}", id);
                return StatusCode(500, new { Message = "An error occurred while updating the user." });
            }
        }

        // DELETE: Delete a user
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(long id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    return NotFound(new { Message = "User not found." });
                }

                _context.Users.Remove(user);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting user with ID {UserId}", id);
                return StatusCode(500, new { Message = "An error occurred while deleting the user." });
            }
        }

        // Helper method to hash the password securely
        private string HashPassword(string password)
        {
            try
            {
                // Generate a random salt
                byte[] salt = new byte[16];
                using (var rng = RandomNumberGenerator.Create())
                {
                    rng.GetBytes(salt);
                }

                // Hash the password with the salt
                byte[] hash = KeyDerivation.GetBytes(
                    password,
                    salt,
                    KeyDerivationPrf.HMACSHA512,
                    iterationCount: 10000,
                    numBytesRequested: 32);

                // Combine the salt and hash into a single string
                byte[] hashBytes = new byte[16 + 32];
                Array.Copy(salt, 0, hashBytes, 0, 16);
                Array.Copy(hash, 0, hashBytes, 16, 32);

                return Convert.ToBase64String(hashBytes);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Error hashing password", ex);
            }
        }

        // Helper class for key derivation
        private static class KeyDerivation
        {
            public static byte[] GetBytes(string password, byte[] salt, KeyDerivationPrf prf, int iterationCount, int numBytesRequested)
            {
                try
                {
                    using (var hmac = new HMACSHA512(salt))
                    {
                        byte[] hashValue = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));

                        // Perform additional iterations
                        for (int i = 1; i < iterationCount; i++)
                        {
                            hashValue = hmac.ComputeHash(hashValue);
                        }

                        if (hashValue.Length == numBytesRequested)
                        {
                            return hashValue;
                        }

                        // If the requested size differs, resize the array
                        byte[] result = new byte[numBytesRequested];
                        Array.Copy(hashValue, result, Math.Min(hashValue.Length, numBytesRequested));
                        return result;
                    }
                }
                catch (Exception ex)
                {
                    throw new InvalidOperationException("Error in key derivation", ex);
                }
            }
        }

        private enum KeyDerivationPrf
        {
            HMACSHA512
        }
    }
}