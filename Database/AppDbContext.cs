using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Kindle_Verse.Models;
using Kindle_Verse.Database.Entities;
using System.Reflection.Emit;


namespace Kindle_Verse.Database
{
    public class AppDbContext : IdentityDbContext<User, IdentityRole<long>, long>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        // Identity user & role already handled by base class
        public DbSet<Admin> Admins { get; set; }
        public DbSet<Staff> Staffs { get; set; }
        public DbSet<Order> Orders { get; set; } = null!;
        public DbSet<OrderItem> OrderItems { get; set; } = null!;
        public DbSet<Book> Books { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Announcement> Announcements { get; set; }

        public DbSet<Bookmark> Bookmarks { get; set; }


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
                    // This hash is for password: "staff123"
                }
            );

            builder.Entity<Cart>()
                .HasMany(c => c.CartItems)
                .WithOne(ci => ci.Cart)
                .HasForeignKey(ci => ci.CartId)
                .OnDelete(DeleteBehavior.Cascade);

            // CartItem - Book relationship (many-to-one)
            builder.Entity<CartItem>()
                .HasOne(ci => ci.Book)
                .WithMany()
                .HasForeignKey(ci => ci.BookId);

            builder.Entity<Order>(entity =>
            {
                entity.ToTable("Orders", "public");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).UseIdentityAlwaysColumn();
                entity.Property(e => e.OrderNumber).HasMaxLength(100).IsRequired();
                entity.Property(e => e.TotalAmount).HasColumnType("decimal(10, 2)").IsRequired();
                entity.Property(e => e.Status).HasMaxLength(20).IsRequired();
                entity.Property(e => e.OrderDate).HasDefaultValueSql("CURRENT_TIMESTAMP");

                // Foreign key relationship with User
                entity.HasOne(e => e.User)
                      .WithMany()
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<OrderItem>(entity =>
            {
                entity.ToTable("OrderItems", "public");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).UseIdentityAlwaysColumn();
                entity.Property(e => e.ProductName).HasMaxLength(100).IsRequired();
                entity.Property(e => e.Price).HasColumnType("decimal(10, 2)").IsRequired();
                entity.Property(e => e.Quantity).IsRequired();

                // Foreign key relationship with Order
                entity.HasOne(e => e.Order)
                      .WithMany(o => o.OrderItems)
                      .HasForeignKey(e => e.OrderId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

        }
    }
}
