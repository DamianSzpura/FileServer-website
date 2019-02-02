﻿using System.Collections.Generic;

namespace FileServer_website.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }

        public string Role { get; set; }
        public string Token { get; set; }

        public string Style { get; set; }

        public List<WebFile> WebFiles { get; set; }
    }
}