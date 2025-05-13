using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Kindle_Verse.Models;
using Kindle_Verse.Database.Entities;
using StackExchange.Redis;

namespace Kindle_Verse.Database
{
    public class AppDbContext : IdentityDbContext<User, IdentityRole<long>, long>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<Staff> Staffs { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Announcement> Announcements { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Seed the "User" role
            builder.Entity<IdentityRole<long>>().HasData(
                new IdentityRole<long>
                {
                    Id = 1L,
                    Name = "User",
                    NormalizedName = "USER"
                }
            );

            // Seed Staff
            builder.Entity<Staff>().HasData(
                new Staff
                {
                    Id = 1,
                    Email = "staff@bookstore.com",
                    PasswordHash = "$2a$12$qQwCEm2/JEyLC6.iZNGj0u7FddDg5A5cMXeFtIaDpHiEjfH33jlQG"
                }
            );

            builder.Entity<User>(entity =>
            {
                entity.ToTable("AspNetUsers", "public");
                entity.Property(e => e.FirstName).HasMaxLength(50).IsRequired();
                entity.Property(e => e.LastName).HasMaxLength(50).IsRequired();
                entity.HasIndex(e => e.Email).IsUnique();
            });

        }
    }
}
