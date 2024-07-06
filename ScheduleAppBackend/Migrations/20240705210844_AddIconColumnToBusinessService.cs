using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ScheduleAppBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddIconColumnToBusinessService : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Icon",
                table: "BusinessesServices",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Icon",
                table: "BusinessesServices");
        }
    }
}
