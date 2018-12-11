using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FileServer_website.Model
{
    public class WebsiteFile
    {
        private string name;
        private string extension;

        public WebsiteFile(string name, string extension)
        {
            this.name = name;
            this.extension = extension;
        }

        public string Name { get => name; set => name = value; }
        public string Extension { get => extension; set => extension = value; }
    }
}