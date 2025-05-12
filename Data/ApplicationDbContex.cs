using Microsoft.EntityFrameworkCore;
using CourseWork.Model.Entity;

namespace CourseWork.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Books> Books { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Purchase> Purchases { get; set; }
        public DbSet<Review> Reviews { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User - Cart relationship (one-to-one)
            modelBuilder.Entity<User>()
                .HasOne(u => u.Cart)
                .WithOne(c => c.User)
                .HasForeignKey<Cart>(c => c.UserId);

            // Cart - CartItem relationship (one-to-many)
            modelBuilder.Entity<Cart>()
                .HasMany(c => c.CartItems)
                .WithOne(ci => ci.Cart)
                .HasForeignKey(ci => ci.CartId)
                .OnDelete(DeleteBehavior.Cascade); // Auto-delete cart items when cart is deleted

            // CartItem - Book relationship
            modelBuilder.Entity<CartItem>()
                .HasOne(ci => ci.Book)
                .WithMany()
                .HasForeignKey(ci => ci.BookId);

            // User - Purchase relationship (one-to-many)
            modelBuilder.Entity<User>()
                .HasMany(u => u.Purchases)
                .WithOne(p => p.User)
                .HasForeignKey(p => p.UserId);

            // Purchase - Book relationship
            modelBuilder.Entity<Purchase>()
                .HasOne(p => p.Book)
                .WithMany()
                .HasForeignKey(p => p.BookId);

            // Review relationships
            modelBuilder.Entity<Review>()
                .HasOne(r => r.User)
                .WithMany()
                .HasForeignKey(r => r.UserId);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.Book)
                .WithMany()
                .HasForeignKey(r => r.BookId);
        }
    }
}