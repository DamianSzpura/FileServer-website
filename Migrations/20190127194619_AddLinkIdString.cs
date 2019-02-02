using Microsoft.EntityFrameworkCore.Migrations;

namespace FileServer_website.Migrations
{
    public partial class AddLinkIdString : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "LinkId",
                table: "Files",
                nullable: true,
                oldClrType: typeof(long),
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<long>(
                name: "LinkId",
                table: "Files",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);
        }
    }
}
