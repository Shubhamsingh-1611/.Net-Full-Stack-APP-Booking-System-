using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SUSS_Booking_System.Migrations
{
    /// <inheritdoc />
    public partial class DBinit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FormD1",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PINumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    PreferredMobile = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    PreferredEmail = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    JobStatus = table.Column<bool>(type: "bit", nullable: false),
                    IndustryWorkingAt = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    EmergencyContactPerson = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    RelationshipToClient = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    EmergencyContactMobile = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    IsClientAgreement = table.Column<bool>(type: "bit", nullable: false),
                    IsDeclaration = table.Column<bool>(type: "bit", nullable: false),
                    DateSubmitted = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsBlackList = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Reason = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    StudentDeferredStatus = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    IsTenToEight = table.Column<bool>(type: "bit", nullable: false),
                    Mymail = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormD1", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FormD1_PINumber",
                table: "FormD1",
                column: "PINumber",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FormD1");
        }
    }
}
