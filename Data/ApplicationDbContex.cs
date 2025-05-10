using Microsoft.EntityFrameworkCore;
using CourseWork.Model.Entity;

namespace CourseWork.Database
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Books> Books { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }

        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
        //    base.OnModelCreating(modelBuilder);

        //    // One-to-many between Cart and CartItems
        //    modelBuilder.Entity<Cart>()
        //        .HasMany(c => c.CartItems)
        //        .WithOne(ci => ci.Cart)
        //        .HasForeignKey(ci => ci.CartId);

        //    // One-to-one between User and Cart
        //    modelBuilder.Entity<Cart>()
        //        .HasOne(c => c.User)
        //        .WithOne()
        //        .HasForeignKey<Cart>(c => c.UserId);
        //}
    }
}
