using System.Threading.Tasks;

namespace Kindle_Verse.Service
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string body);
    }
}