using Kindle_Verse.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using Kindle_Verse.Database;     
using Kindle_Verse.Models;
using Kindle_Verse.Database.Entities;

[ApiController]
[Route("api/[controller]")]
public class PromoController : ControllerBase
{
    private readonly AppDbContext _context;

    public PromoController(AppDbContext context)
    {
        _context = context;
    }


    private string GeneratePromoCode(string prefix)
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var random = new Random();
        var suffix = new string(Enumerable.Repeat(chars, 4)
            .Select(s => chars[random.Next(chars.Length)]).ToArray());

        return $"{prefix}-{suffix}";
    }

    [HttpPost("Generate")]
    public async Task<IActionResult> GeneratePromoAfterOrder([FromBody] int userId)
    {
        var completedOrders = await _context.Orders
            .Where(o => o.UserId == userId && o.Status == "Completed")
            .CountAsync();

        if (completedOrders == 5 || completedOrders == 10)
        {
            decimal discountRate = completedOrders == 5 ? 0.05m : 0.10m;
            string prefix = completedOrders == 5 ? "LYL5" : "LYL10";

            var alreadyExists = await _context.PromoCodes
                .AnyAsync(p => p.UserId == userId && p.DiscountRate == discountRate);

            if (!alreadyExists)
            {
                var code = GeneratePromoCode(prefix);

                var promo = new PromoCode
                {
                    Code = code,
                    DiscountRate = discountRate,
                    UserId = userId,
                    IsUsed = false
                };

                _context.PromoCodes.Add(promo);
                await _context.SaveChangesAsync();
                Console.WriteLine("Promo code saved");

                return Ok(new { success = true, generated = true, code });
            }

            return Ok(new { success = true, generated = false, message = "Promo code already exists." });
        }

        return Ok(new { success = false, message = "Not eligible for promo code." });
    }


    [HttpGet("MyPromoCodes")]
    public async Task<IActionResult> GetMyPromoCodes(int userId)
    {
        var codes = await _context.PromoCodes
            .Where(p => p.UserId == userId && !p.IsUsed)
            .Select(p => new {
                p.Code,
                p.DiscountRate,
                p.CreatedAt
            })
            .ToListAsync();

        return Ok(codes);
    }


    [HttpGet("Apply")]
    public async Task<IActionResult> ApplyPromo(int userId, int totalItemCount, string? promoCode = null)
    {
        decimal volumeDiscount = totalItemCount >= 5 ? 0.05m : 0.0m;
        decimal promoDiscount = 0.0m;

        string message;
        bool success = false;

        if (!string.IsNullOrEmpty(promoCode))
        {
            var promo = await _context.PromoCodes
                .FirstOrDefaultAsync(p => p.Code == promoCode && p.UserId == userId && !p.IsUsed);

            if (promo != null)
            {
                promoDiscount = promo.DiscountRate;
                message = "Promo code applied successfully.";
                success = true;
            }
            else
            {
                message = "Invalid or expired promo code.";
            }
        }
        else
        {
            message = volumeDiscount > 0 ? "Volume discount applied." : "No discount available.";
            success = volumeDiscount > 0;
        }

        return Ok(new
        {
            success,
            totalDiscountRate = volumeDiscount + promoDiscount,
            volumeDiscount,
            promoDiscount,
            message
        });
    }

    [HttpPost("MarkUsed")]
    public async Task<IActionResult> MarkPromoAsUsed([FromBody] string code)
    {
        var promo = await _context.PromoCodes.FirstOrDefaultAsync(p => p.Code == code);
        if (promo != null)
        {
            promo.IsUsed = true;
            await _context.SaveChangesAsync();
            return Ok(new { success = true });
        }

        return NotFound(new { success = false, message = "Promo code not found." });
    }
}