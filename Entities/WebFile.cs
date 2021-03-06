﻿using System;

namespace FileServer_website.Entities
{
    public class WebFile
    {
        public int Id { get; set; }

        public string LinkId { get; set; }
        public string Name { get; set; }
        public string Extension { get; set; }
        public string Comment { get; set; }
        public long Size { get; set; }
        public string Path { get; set; }
        public DateTime DateCreation { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }
    }
}