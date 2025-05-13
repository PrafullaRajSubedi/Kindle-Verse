using Microsoft.EntityFrameworkCore;
using Kindle_Verse.Database;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using Microsoft.Extensions.Logging;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add logging
builder.Services.AddLogging(logging =>
{
    logging.ClearProviders();
    logging.AddConsole();
    logging.AddDebug();
});

// IMPORTANT: Always use 'kindle_verse' as the database name
string connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ??
    "Host=localhost;Port=5432;Database=kindle_verse;Username=postgres;Password=admin";

// Register PostgreSQL DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(connectionString);
    // Enable detailed error messages for debugging
    if (builder.Environment.IsDevelopment())
    {
        options.EnableDetailedErrors();
        options.EnableSensitiveDataLogging();
    }
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

    options.AddPolicy("AllowAll",
        policy => policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

// Try to connect to PostgreSQL with better error handling
try
{
    using (var scope = app.Services.CreateScope())
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogInformation("Testing database connection...");
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        // Ensure database exists (creates database if it doesn't exist)
        logger.LogInformation("Ensuring database exists...");
        dbContext.Database.EnsureCreated();

        // Now test the connection after ensuring database exists
        var canConnect = dbContext.Database.CanConnect();
        if (canConnect)
        {
            logger.LogInformation("✅ Successfully connected to PostgreSQL!");

            // If you're using migrations, uncomment this section to apply pending migrations
            // This is generally better than EnsureCreated for production apps
            /*
            if (dbContext.Database.GetPendingMigrations().Any())
            {
                logger.LogInformation("Applying pending migrations...");
                dbContext.Database.Migrate();
            }
            */
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
    app.UseDeveloperExceptionPage();
}

app.UseCors("AllowAll"); // Use the most permissive CORS policy for now

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// Add a simple test endpoint that doesn't require database connection
app.MapGet("/api/test", () => new { Message = "API is running", Timestamp = DateTime.UtcNow });

app.Run();