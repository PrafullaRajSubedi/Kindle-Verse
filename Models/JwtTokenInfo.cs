namespace Kindle_Verse.Models
{
    public class JwtTokenInfo
    {
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public int ExpiresInMinutes { get; set; }
        public string Key { get; set; }
    }
}
