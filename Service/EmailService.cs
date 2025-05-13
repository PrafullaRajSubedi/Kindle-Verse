using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace Kindle_Verse.Service
{
    public class EmailService : IEmailService
    {
        private readonly SmtpClient _smtpClient;
        private readonly string _fromEmail;

        public EmailService()
        {
            _smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential("kindleversebooks@gmail.com", "qkbh amzp svhe ulvr"),
                EnableSsl = true,
            };
            _fromEmail = "kindleversebooks@gmail.com";
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var mailMessage = new MailMessage(_fromEmail, toEmail, subject, body);
            await _smtpClient.SendMailAsync(mailMessage);
        }
    }
}