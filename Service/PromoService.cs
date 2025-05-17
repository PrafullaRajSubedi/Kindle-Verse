using Kindle_Verse.Database;
using Kindle_Verse.Database.Entities;
using Microsoft.EntityFrameworkCore;

public class PromoService
{
    private readonly AppDbContext _context;

    public PromoService(AppDbContext context)
    {
        _context = context;
    }

    public async Task GeneratePromoIfEligible(int userId)
    {
        var completedOrders = await _context.Orders
            .Where(o => o.UserId == userId && o.Status == "Completed")
            .CountAsync();

        if (completedOrders == 5 || completedOrders == 10)
        {
            decimal discountRate = completedOrders == 5 ? 0.05m : 0.10m;
            string prefix = completedOrders == 5 ? "LYL5" : "LYL10";

            bool alreadyExists = await _context.PromoCodes
                .AnyAsync(p => p.UserId == userId && p.DiscountRate == discountRate);

            if (!alreadyExists)
            {
                string code = GeneratePromoCode(prefix);

                _context.PromoCodes.Add(new PromoCode
                {
                    Code = code,
                    DiscountRate = discountRate,
                    UserId = userId,
                    IsUsed = false
                });

                await _context.SaveChangesAsync();
            }
        }
    }

    private string GeneratePromoCode(string prefix)
    {
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var random = new Random();
        var suffix = new string(Enumerable.Repeat(chars, 4)
            .Select(s => chars[random.Next(chars.Length)]).ToArray());
        return $"{prefix}-{suffix}";
    }
}
