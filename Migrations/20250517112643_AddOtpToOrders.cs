using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Kindle_Verse.Migrations
{
    /// <inheritdoc />
    public partial class AddOtpToOrders : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Otp",
                schema: "public",
                table: "Orders",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Otp",
                schema: "public",
                table: "Orders");
        }
    }
}
