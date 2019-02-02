using Microsoft.EntityFrameworkCore.Migrations;

namespace FileServer_website.Migrations
{
    public partial class ChangedFile : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "LinkId",
                table: "Files",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LinkId",
                table: "Files");
        }
    }
}
