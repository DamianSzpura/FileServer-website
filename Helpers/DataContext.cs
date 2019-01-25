using Microsoft.EntityFrameworkCore;
using FileServer_website.Entities;

namespace FileServer_website.Helpers
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<WebFile> Files { get; set; }
    }
}