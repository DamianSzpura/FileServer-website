using FileServer_website.Model;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;

namespace FileServer_website.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class UploadController : Controller
    {
        private IHostingEnvironment _hostingEnvironment;
        private string _pathToFolder;

        public UploadController(IHostingEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
            _pathToFolder = Path.Combine(_hostingEnvironment.WebRootPath, "Upload");
        }

        [HttpPost, DisableRequestSizeLimit]
        public ActionResult UploadFile()
        {
            try
            {
                CopyFileToServer();
                return Json("Upload Successful!");
            }
            catch (Exception ex)
            {
                return Json("Upload Failed: " + ex.Message);
            }
        }

        private void CopyFileToServer()
        {
            var files = Request.Form.Files;

            if (!Directory.Exists(_pathToFolder))
            {
                Directory.CreateDirectory(_pathToFolder);
            }
            foreach (var file in files)
            {
                if (file.Length <= 0)
                    throw new IOException(string.Format("File length is equal 0. Cannot upload such a file."));
                else
                {
                    string fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    string fullPathToFile = Path.Combine(_pathToFolder, fileName);
                    using (var stream = new FileStream(fullPathToFile, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }
            }
        }

        [HttpDelete]
        public ActionResult DeleteFile()
        {
            try
            {
                DeleteFileFromServer();
                return Json("Deleting Successful!");
            }
            catch (Exception ex)
            {
                return Json("Deleting Failed: " + ex.Message);
            }
        }

        private void DeleteFileFromServer()
        {
            var file = Request.Form.ToList();
            string fileName = file[0].Value;
            string fullPathToFile = Path.Combine(_pathToFolder, fileName);

            if (!System.IO.File.Exists(fullPathToFile))
                throw new IOException(string.Format("File " + fileName + " does not exist."));
            else
                System.IO.File.Delete(fullPathToFile);
        }

        [HttpGet("files")]
        public IEnumerable<WebsiteFile> GetFiles()
        {
            IEnumerable<WebsiteFile> files = from file
                                             in Directory.EnumerateFileSystemEntries(_pathToFolder)
                                             orderby Path.GetExtension(file)
                                             select new WebsiteFile(Path.GetFileName(file), Path.GetExtension(file).ToUpper());

            if (!Directory.Exists(_pathToFolder) || !(files.Count() > 0))
            {
                return new WebsiteFile[] { };
            }

            return files;
        }
    }
}