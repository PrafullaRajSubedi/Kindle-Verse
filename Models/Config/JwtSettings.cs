namespace Kindle_Verse.Models.Config
{
    public class JwtSettings
    {
        internal readonly double ExpiresInMinutes;

        public string Key { get; set; }
        public string Issuer { get; set; }
        public string Audience { get; set; }
    }
}