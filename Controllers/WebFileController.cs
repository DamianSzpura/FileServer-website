using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using AutoMapper;
using FileServer_website.Dtos;
using FileServer_website.Entities;
using FileServer_website.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FileServer_website.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/server")]
    public class WebFileController : ControllerBase
    {
        private IHostingEnvironment _hostingEnvironment;
        private IMapper _mapper;
        private IWebFileService _webFileService;

        public WebFileController(
            IHostingEnvironment hostingEnvironment,
            IMapper mapper,
            IWebFileService webFileService)
        {
            _hostingEnvironment = hostingEnvironment;
            _mapper = mapper;
            _webFileService = webFileService;
        }

        [HttpPost("upload/{path}"), DisableRequestSizeLimit]
        public IActionResult AddFileToServer(String path)
        {
            try
            {
                _webFileService.AddFileToServer(editPath(path), Request.Form.Files);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("upload/{path}/db")]
        public IActionResult AddFileToDb(String path, [FromBody]WebFileDto[] fileDto)
        {
            var fileInfoArray = _mapper.Map<WebFile[]>(fileDto);

            foreach (WebFile fileInfo in fileInfoArray)
            {
                fileInfo.Path = editPath(fileInfo.Path);
            }

            try
            {
                _webFileService.AddFileToDb(fileInfoArray);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("upload/{path}/addfolder")]
        public IActionResult AddSubDirectory(string path, [FromBody]WebFileDto fileDto)
        {
            var fileInfo = _mapper.Map<WebFile>(fileDto);

            try
            {
                _webFileService.AddSubDirectory(editPath(path), fileInfo);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("files/{path}/{searchFor}")]
        public IActionResult GetAll(string path, string searchFor)
        {
            var files = _webFileService.GetAll(editPath(path), searchFor);
            var filesDtos = _mapper.Map<IList<WebFileDto>>(files);

            return Ok(filesDtos);
        }

        [HttpGet("file/{path}/{fileName}/download")]
        public IActionResult GetDataByName(string path, string fileName)
        {
            try
            {
                var fileData = _webFileService.GetDataByName(editPath(path), fileName);
                return File(fileData, "application/octet-stream", fileName);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("change/{path}")]
        public IActionResult ChangeFile(string path, [FromBody]WebFileDto fileDto)
        {
            var fileInfo = _mapper.Map<WebFile>(fileDto);

            try
            {
                _webFileService.ChangeFile(editPath(path), fileInfo);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPatch("delete/{path}")]
        public IActionResult DeleteFile(string path, [FromBody]WebFileDto fileDto)
        {
            var fileInfo = _mapper.Map<WebFile>(fileDto);

            try
            {
                _webFileService.DeleteFile(editPath(path), fileInfo);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /* [HttpGet("file/{path}/{fileName}/download")]
         public IActionResult GetInfoByName(string path, string fileName)
         {
             try
             {
                 var fileData = System.IO.File.ReadAllBytes(fullPathToFile);
                 return Ok(File(fileData, "application/octet-stream", fileName));
             }
             catch (Exception ex)
             {
                 return BadRequest(new { message = ex.Message });
             }
         }*/

        private String editPath(String path)
        {
            if (path.Contains(">"))
                return Path.Combine(Path.Combine(_hostingEnvironment.WebRootPath, "files"), path.Replace(">", "\\"));
            else
                return Path.Combine(Path.Combine(_hostingEnvironment.WebRootPath, "files"), path.Replace("/", "\\"));
        }
    }
}

/*   [HttpDelete]
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
   }
   */