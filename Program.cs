using Microsoft.EntityFrameworkCore;
using Kindle_Verse.Database;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using Microsoft.Extensions.Logging;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add logging
builder.Services.AddLogging(logging =>
{
    logging.ClearProviders();
    logging.AddConsole();
    logging.AddDebug();
});

// IMPORTANT: Temporarily hardcode a connection string to test connection
// You can revert to configuration-based approach once this works
string connectionString = "Host=localhost;Port=5432;Database=postgres;Username=postgres;Password=admin";
// ⚠️ Replace "postgres" with the actual password you know works, or try PostgreSQL's default password

// Register PostgreSQL DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(connectionString);
    // Enable detailed error messages for debugging
    options.EnableDetailedErrors();
    options.EnableSensitiveDataLogging();
});

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins",
        policy => policy
            .WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

var app = builder.Build();

// Try to connect to PostgreSQL with simplified error handling
try
{
    using (var scope = app.Services.CreateScope())
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogInformation("Testing database connection...");

        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        // Just try to connect without creating or migrating
        var canConnect = dbContext.Database.CanConnect();

        if (canConnect)
        {
            logger.LogInformation("✅ Successfully connected to PostgreSQL!");

            // Only attempt migrations if connected successfully
            if (dbContext.Database.GetPendingMigrations().Any())
            {
                logger.LogInformation("Applying pending migrations...");
                dbContext.Database.Migrate();
            }
        }
        else
        {
            logger.LogError("❌ Could not connect to PostgreSQL database.");
        }
    }
}
catch (Exception ex)
{
    // Log the exact error for troubleshooting
    Console.WriteLine($"DATABASE CONNECTION ERROR: {ex.GetType().Name}");
    Console.WriteLine($"MESSAGE: {ex.Message}");
    Console.WriteLine($"SOURCE: {ex.Source}");
    Console.WriteLine("STACK TRACE:");
    Console.WriteLine(ex.StackTrace);

    if (ex.InnerException != null)
    {
        Console.WriteLine("INNER EXCEPTION:");
        Console.WriteLine(ex.InnerException.Message);
    }

    // Continue application startup - we'll fix the DB connection later
    Console.WriteLine("Application will continue without database connectivity");
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowSpecificOrigins");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// Add a simple test endpoint that doesn't require database connection
app.MapGet("/api/test", () => new { Message = "API is running", Timestamp = DateTime.UtcNow });

app.Run();