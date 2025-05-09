using Kindle_Verse.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Kindle_Verse.Database.Entities;

namespace Kindle_Verse.Database
{
    public class AppDbContext : IdentityDbContext<User, IdentityRole<long>, long>
    {
        public AppDbContext(DbContextOptions options) : base(options) { }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Seed only "User" role
            builder.Entity<IdentityRole<long>>().HasData(
                new IdentityRole<long> { Id = 1, Name = "User", NormalizedName = "USER" }
            );
        }
    }
}
