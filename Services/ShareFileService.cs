using FileServer_website.Entities;
using FileServer_website.Helpers;
using System.IO;
using System.Linq;

namespace FileServer_website.Controllers
{
    public interface IShareFileService
    {
        WebFile GetFile(string linkId);

        object GetDataByLinkId(string linkId);
    }

    public class ShareFileService : IShareFileService
    {
        private DataContext _context;

        public ShareFileService(DataContext context)
        {
            _context = context;
        }

        public object GetDataByLinkId(string linkId)
        {
            WebFile fileInfo = this.GetFile(linkId);

            string fullPathToFile = Path.Combine(fileInfo.Path, fileInfo.Name);
            return new { fileBytes = File.ReadAllBytes(fullPathToFile), fileName = fileInfo.Name };
        }

        public WebFile GetFile(string linkId)
        {
            return _context.Files.SingleOrDefault(x => x.LinkId == linkId);
        }
    }
}