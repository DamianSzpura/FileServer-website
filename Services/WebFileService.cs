using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using FileServer_website.Entities;
using FileServer_website.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FileServer_website.Services
{
    public interface IWebFileService
    {
        void AddFileToServer(string path, IFormFileCollection files);

        void AddFileToDb(WebFile[] fileInfoArray);

        void AddSubDirectory(string path, WebFile fileInfo);

        IEnumerable<WebFile> GetAll(string path, string searchFor);

        byte[] GetDataByName(string path, string fileName);

        WebFile GetInfoByName(string path, string fileName);
    }

    public class WebFileService : IWebFileService
    {
        private DataContext _context;

        public WebFileService(DataContext context)
        {
            _context = context;
        }

        public void AddFileToServer(string path, IFormFileCollection files)
        {
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }

            foreach (var file in files)
            {
                if (file.Length <= 0)
                    throw new AppException(string.Format("File length is equal 0. Cannot upload such a file."));
                else
                {
                    string fullPathToFile = Path.Combine(path, file.Name);
                    using (var stream = new FileStream(fullPathToFile, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }
            }
        }

        public void AddFileToDb(WebFile[] fileInfoArray)
        {
            foreach (WebFile fileInfo in fileInfoArray)
            {
                fileInfo.Extension = Path.GetExtension(Path.Combine(fileInfo.Path, fileInfo.Name));
                fileInfo.Comment = "";

                if (fileInfo.Size <= 0)
                    throw new AppException(string.Format("File length is equal 0. Cannot upload such a file."));
                else
                {
                    _context.Files.Add(fileInfo);
                }
            }
            _context.SaveChanges();
        }

        public void AddSubDirectory(string path, WebFile fileInfo)
        {
            string pathToNewDirectory = Path.Combine(path, fileInfo.Name);
            string pathToNewNonCopyDirectory = pathToNewDirectory;
            int copyNumber = 0;
            bool copyFound = false;

            while (Directory.Exists(pathToNewNonCopyDirectory))
            {
                copyNumber++;
                pathToNewNonCopyDirectory = pathToNewDirectory + "(" + copyNumber + ")";
                copyFound = true;
            }

            if (copyFound)
            {
                fileInfo.Name += "(" + copyNumber + ")";
            }

            fileInfo.Path = path;
            fileInfo.DateCreation = DateTime.Today;
            fileInfo.Comment = "";
            fileInfo.Extension = "";

            Directory.CreateDirectory(pathToNewNonCopyDirectory);
            _context.Files.Add(fileInfo);
            _context.SaveChanges();
        }

        public IEnumerable<WebFile> GetAll(string path, string searchFor)
        {
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }

            var allFiles = Directory.GetFileSystemEntries(path, "*" + searchFor + "*");

            if (searchFor == "-")
            {
                var files = from file in _context.Files
                            orderby file.Extension
                            where file.Path == path
                            select file;

                return files;
            }
            else
            {
                var files = from file in _context.Files
                            orderby file.Extension
                            where file.Path == path && file.Name.Contains(searchFor)
                            select file;

                return files;
            }
        }

        public byte[] GetDataByName(string path, string fileName)
        {
            string fullPathToFile = Path.Combine(path, fileName);
            return File.ReadAllBytes(fullPathToFile);
        }

        public WebFile GetInfoByName(string path, string fileName)
        {
            throw new NotImplementedException();
        }
    }
}