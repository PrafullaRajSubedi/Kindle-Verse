﻿namespace Kindle_Verse.Models
{
    public class EmailSettings
    {
        public string FromEmail { get; set; }
        public string SmtpServer { get; set; }
        public int Port { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
    }

}
