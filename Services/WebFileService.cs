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

namespace FileServer_website.Services
{
    public interface IWebFileService
    {
        void AddFileToServer(string path, IFormFileCollection files);

        void AddFileToDb(WebFile[] fileInfoArray);

        void AddSubDirectory(string path, WebFile fileInfo);

        IEnumerable<WebFile> GetAll(string path, string searchFor);

        byte[] GetDataByName(string path, string fileName);

        void DeleteFile(string path, WebFile fileInfo);

        void ChangeFile(string path, WebFile fileInfo);
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
            var files = this.GetAll(fileInfoArray[0].Path, "-");

            foreach (WebFile fileInfo in fileInfoArray)
            {
                fileInfo.Extension = Path.GetExtension(Path.Combine(fileInfo.Path, fileInfo.Name));
                fileInfo.Comment = "";
                fileInfo.LinkId = Guid.NewGuid().ToString("N");

                if (files.Any(x => x.Name == fileInfo.Name))
                    throw new AppException(string.Format("That file is already in folder."));

                if (fileInfo.Size <= 0)
                    throw new AppException(string.Format("File length is equal 0. Cannot upload such a file."));

                _context.Files.Add(fileInfo);
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

        public void DeleteFile(string path, WebFile fileInfo)
        {
            string fileName = fileInfo.Name;
            string fullPathToFile = Path.Combine(path, fileName);

            if (!(fileInfo.Extension == null || fileInfo.Extension == ""))
            {
                if (!File.Exists(fullPathToFile))
                    throw new AppException(string.Format("File " + fileName + " does not exist."));
                else
                    File.Delete(fullPathToFile);
            }
            else
            {
                if (!Directory.Exists(fullPathToFile))
                    throw new AppException(string.Format("Directory " + fileName + " does not exist."));
                else if (Directory.GetFileSystemEntries(fullPathToFile).Length == 0)
                    throw new AppException(string.Format("Directory is not empty."));
                else
                    Directory.Delete(fullPathToFile);

                var filesInDirectory = GetAll(Path.Combine(path, fileInfo.Name), "-");
                _context.Files.RemoveRange(filesInDirectory);
            }

            var fileToDelete = _context.Files.Find(fileInfo.Id);
            _context.Files.Remove(fileToDelete);
            _context.SaveChanges();
        }

        public void ChangeFile(string path, WebFile fileInfo)
        {
            string fileName;
            if (!(fileInfo.Extension == null || fileInfo.Extension == "") && !fileInfo.Name.EndsWith(fileInfo.Extension))
                fileName = fileInfo.Name + fileInfo.Extension;
            else
                fileName = fileInfo.Name;

            var oldFile = _context.Files.Find(fileInfo.Id);

            if (oldFile == null)
                throw new AppException("File not found");

            if (fileInfo.Name != oldFile.Name || fileInfo.Path != oldFile.Path)
            {
                if (_context.Files.Any(x => x.Name == fileInfo.Name && x.Path == fileInfo.Path))
                    throw new AppException("File name " + fileInfo.Name + " is already taken in that directory.");

                if (fileInfo.Extension == null || fileInfo.Extension == "")
                {
                    var filesInDirectory = GetAll(Path.Combine(path, oldFile.Name), "-");

                    if (fileInfo.Path != oldFile.Path)
                    {
                        foreach (WebFile file in filesInDirectory)
                        {
                            file.Path = file.Path.Replace(oldFile.Path, fileInfo.Path);
                        }
                    }
                    else
                    {
                        foreach (WebFile file in filesInDirectory)
                        {
                            file.Path = file.Path.Replace(oldFile.Name, fileInfo.Name);
                        }
                    }
                    _context.Files.UpdateRange(filesInDirectory);
                    Directory.Move(Path.Combine(oldFile.Path, oldFile.Name), Path.Combine(fileInfo.Path, fileName));
                }
                else
                    File.Move(Path.Combine(oldFile.Path, oldFile.Name), Path.Combine(fileInfo.Path, fileName));

                oldFile.Path = fileInfo.Path;
                oldFile.Name = fileName;
            }

            oldFile.Comment = fileInfo.Comment;

            _context.Files.Update(oldFile);
            _context.SaveChanges();
        }
    }
}