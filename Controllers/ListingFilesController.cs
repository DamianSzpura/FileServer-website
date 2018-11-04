using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FileServer_website.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ListingFilesController : ControllerBase
    {
        // GET: api/ListingFiles
        [HttpGet("/Files")]
        public IEnumerable<string> GetFiles()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/ListingFiles/5
        [HttpGet("{id}", Name = "Get")]
        public string Get(int id)
        {
            return "value";
        }
    }
}