using Kindle_Verse.Services;
using Kindle_Verse.Models.Config;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhostFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173") 
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddMemoryCache();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
builder.Services.AddSingleton<JwtTokenGenerator>();
builder.Services.AddSingleton<IEmailService, EmailService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.UseCors("AllowLocalhostFrontend"); 
app.MapControllers();

app.Run();
