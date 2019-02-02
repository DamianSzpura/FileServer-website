using System;
using AutoMapper;
using FileServer_website.Dtos;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace FileServer_website.Controllers
{
    [Produces("application/json")]
    [Route("api/server/share")]
    public class ShareFileController : ControllerBase
    {
        private IHostingEnvironment _hostingEnvironment;
        private IMapper _mapper;
        private IShareFileService _shareFileService;

        public ShareFileController(
            IHostingEnvironment hostingEnvironment,
            IMapper mapper,
            IShareFileService shareFileService)
        {
            _hostingEnvironment = hostingEnvironment;
            _mapper = mapper;
            _shareFileService = shareFileService;
        }

        [HttpGet("file/{linkId}")]
        public IActionResult GetFile(string linkId)
        {
            var file = _shareFileService.GetFile(linkId);
            var fileDtos = _mapper.Map<WebFileDto>(file);

            return Ok(fileDtos);
        }

        [HttpGet("file/download/{linkId}")]
        public IActionResult GetDataLinkId(string linkId)
        {
            try
            {
                dynamic fileData = _shareFileService.GetDataByLinkId(linkId);
                return File(fileData.fileBytes, "application/octet-stream", fileData.fileName);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}