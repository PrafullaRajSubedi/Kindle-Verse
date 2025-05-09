using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Kindle_Verse.Migrations
{
    /// <inheritdoc />
    public partial class AddBookFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CoverImagePath",
                table: "Books",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CoverImagePath",
                table: "Books");
        }
    }
}
