using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Kindle_Verse.Database;
using System.Text;
using Kindle_Verse.Service;
using Kindle_Verse.Database.Entities;
using Kindle_Verse.Models;
using Kindle_Verse.Models.Config;

var builder = WebApplication.CreateBuilder(args);

// Configure logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

builder.Services.AddMemoryCache();

// Add CORS support for React
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});

// Configure database connection
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgresConnection"))
           .LogTo(Console.WriteLine));

// Configure Identity
builder.Services.AddIdentity<User, IdentityRole<long>>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

// Configure Email Settings
var emailSettings = builder.Configuration.GetSection("EmailSettings");
builder.Services.Configure<EmailSettings>(emailSettings);

Console.WriteLine($"Email Settings - FromEmail: {emailSettings["FromEmail"]}");
Console.WriteLine($"Email Settings - SmtpServer: {emailSettings["SmtpServer"]}");
Console.WriteLine($"Email Settings - Port: {emailSettings["Port"]}");
Console.WriteLine($"Email Settings - Username: {emailSettings["Username"]}");
Console.WriteLine($"Email Settings - Password: {emailSettings["Password"]?.Substring(0, 3)}***");

// Add JWT services
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
builder.Services.AddSingleton<JwtTokenGenerator>();
builder.Services.AddSingleton<IEmailService, EmailService>();
builder.Services.AddScoped<JwtService>();

// 🔥 Suppress redirect for unauthorized requests
builder.Services.Configure<Microsoft.AspNetCore.Authentication.AuthenticationOptions>(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
});

// Configure JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
            ValidAudience = builder.Configuration["JwtSettings:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Key"])),
            ClockSkew = TimeSpan.Zero
        };

        // Prevent redirect to /Account/Login
        options.Events = new JwtBearerEvents
        {
            OnChallenge = context =>
            {
                context.HandleResponse();
                context.Response.StatusCode = 401;
                context.Response.ContentType = "application/json";
                return context.Response.WriteAsync("{\"error\":\"Unauthorized\"}");
            }
        };
    });

// Register controllers
builder.Services.AddControllers();

// Enable Swagger + JWT support
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header
            },
            new List<string>()
        }
    });
});

var app = builder.Build();

// Enable CORS for React
app.UseCors("AllowReact");

// Enable Swagger for testing
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Enable authentication and authorization
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

// Map controllers
app.MapControllers();

app.Run();
