using Microsoft.EntityFrameworkCore;
using Kindle_Verse.Database.Entities;

namespace Kindle_Verse.Database
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<UpdateProfile> UpdateProfiles { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Define entity configurations if needed
            modelBuilder.Entity<UpdateProfile>()
                .HasIndex(p => p.Email)
                .IsUnique();
        }
    }
}