using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ScheduleAppBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddBusinessCustomUrl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "Price",
                table: "BusinessesServices",
                type: "numeric",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "numeric");

            migrationBuilder.AddColumn<string>(
                name: "BusinessUrl",
                table: "Businesses",
                type: "character varying(60)",
                maxLength: 60,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddUniqueConstraint(
                name: "UN_Businesses_BusinessUrl",
                table: "Businesses",
                column: "BusinessUrl");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropUniqueConstraint(
                name: "UN_Businesses_BusinessUrl",
                table: "Businesses");

            migrationBuilder.DropColumn(
                name: "CustomUrl",
                table: "Businesses");

            migrationBuilder.AlterColumn<decimal>(
                name: "Price",
                table: "BusinessesServices",
                type: "numeric",
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "numeric",
                oldNullable: true);
        }
    }
}
