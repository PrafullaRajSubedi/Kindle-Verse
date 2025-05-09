﻿using System.ComponentModel.DataAnnotations;

namespace Kindle_Verse.Models
{
    public class LoginDto
    {
        [Required, EmailAddress] public string? Email { get; set; }
        [Required] public string? Password { get; set; }
    }
}
