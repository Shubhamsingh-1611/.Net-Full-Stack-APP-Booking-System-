using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SUSS_Booking_System.Migrations
{
    /// <inheritdoc />
    public partial class AddEntraObjectId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EntraObjectId",
                table: "FormD1",
                type: "nvarchar(36)",
                maxLength: 36,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EntraObjectId",
                table: "FormD1");
        }
    }
}
