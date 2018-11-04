using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.IO;
using System.Net.Http.Headers;
using System.Linq;

namespace FileServer_website.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class UploadController : Controller
    {
        private IHostingEnvironment _hostingEnvironment;

        //lol
        public UploadController(IHostingEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        [HttpPost, DisableRequestSizeLimit]
        public ActionResult UploadFile()
        {
            try
            {
                CopyFileToServer();
                return Json("Upload Successful!");
            }
            catch (System.Exception ex)
            {
                return Json("Upload Failed: " + ex.Message);
            }
        }

        private void CopyFileToServer()
        {
            var file = Request.Form.Files[0];
            string folderName = "Upload";
            string pathToFolder = Path.Combine(_hostingEnvironment.WebRootPath, folderName);

            if (!Directory.Exists(pathToFolder))
            {
                Directory.CreateDirectory(pathToFolder);
            }

            if (file.Length <= 0)
                throw new IOException(string.Format("File length is equal 0. Cannot upload such a file."));
            else
            {
                string fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                string fullPathToFile = Path.Combine(pathToFolder, fileName);
                using (var stream = new FileStream(fullPathToFile, FileMode.Create))
                {
                    file.CopyTo(stream);
                }
            }
        }

        [HttpGet("files")]
        public IEnumerable<string> GetFiles()
        {
            string folderName = "Upload";
            string pathToFolder = Path.Combine(_hostingEnvironment.WebRootPath, folderName);

            var filesNames = from file
                 in Directory.EnumerateFiles(pathToFolder)
                             select Path.GetFileName(file);

            if (!Directory.Exists(pathToFolder) || !(filesNames.Count() > 0))
            {
                return new string[] { "Nothing in here, sorry" };
            }

            return filesNames;
        }
    }
}