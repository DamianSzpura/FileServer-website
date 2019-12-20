using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FileServer_website.Dtos
{
    public class SendMailDto
    {
        public string sendToEmail { get; set; }
        public string link { get; set; }
    }
}

