using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ScheduleAppBackend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateLocationCitiesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LocationCities_LocationTimeZones_TimeZoneId",
                table: "LocationCities");

            migrationBuilder.AlterColumn<int>(
                name: "TimeZoneId",
                table: "LocationCities",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddForeignKey(
                name: "FK_LocationCities_LocationTimeZones_TimeZoneId",
                table: "LocationCities",
                column: "TimeZoneId",
                principalTable: "LocationTimeZones",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LocationCities_LocationTimeZones_TimeZoneId",
                table: "LocationCities");

            migrationBuilder.AlterColumn<int>(
                name: "TimeZoneId",
                table: "LocationCities",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_LocationCities_LocationTimeZones_TimeZoneId",
                table: "LocationCities",
                column: "TimeZoneId",
                principalTable: "LocationTimeZones",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
