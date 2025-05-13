public class PromoCodeServices
{
    public int Id { get; set; }
    public string Code { get; set; }        
    public decimal DiscountRate { get; set; } 
    public int UserId { get; set; }
    public bool IsUsed { get; set; } = false;
}