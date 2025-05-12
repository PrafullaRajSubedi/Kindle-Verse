using Microsoft.EntityFrameworkCore;
using Kindle_Verse.Database.Entities;

namespace Kindle_Verse.Database
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Staff> Staffs { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Announcement> Announcements { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed staff
            modelBuilder.Entity<Staff>().HasData(
                new Staff
                {
                    Id = 1,
                    Email = "staff@bookstore.com",
                    PasswordHash = "$2a$12$qQwCEm2/JEyLC6.iZNGj0u7FddDg5A5cMXeFtIaDpHiEjfH33jlQG"
                    //PasswordHash = BCrypt.Net.BCrypt.HashPassword("staff123")
                }
            );
        }
    }
}
