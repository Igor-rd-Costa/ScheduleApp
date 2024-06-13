using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ScheduleAppBackend.Migrations
{
    /// <inheritdoc />
    public partial class CreateLocationTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Businesses",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "AddressNumber",
                table: "Businesses",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CityCode",
                table: "Businesses",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "CountryCode",
                table: "Businesses",
                type: "character varying(2)",
                maxLength: 2,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "StateCode",
                table: "Businesses",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "LocationCities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    TimeZone = table.Column<string>(type: "text", nullable: false),
                    Country = table.Column<string>(type: "character varying(2)", maxLength: 2, nullable: false),
                    State = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LocationCities", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "LocationCountries",
                columns: table => new
                {
                    ISOCode = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LocationCountries", x => x.ISOCode);
                });

            migrationBuilder.CreateTable(
                name: "LocationStates",
                columns: table => new
                {
                    Code = table.Column<string>(type: "text", nullable: false),
                    CountryCode = table.Column<string>(type: "character varying(2)", maxLength: 2, nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LocationStates", x => new { x.Code, x.CountryCode });
                });

            migrationBuilder.CreateTable(
                name: "LocationTimeZones",
                columns: table => new
                {
                    Name = table.Column<string>(type: "text", nullable: false),
                    Offset = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LocationTimeZones", x => x.Name);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Businesses_CityCode",
                table: "Businesses",
                column: "CityCode");

            migrationBuilder.CreateIndex(
                name: "IX_Businesses_CountryCode",
                table: "Businesses",
                column: "CountryCode");

            migrationBuilder.CreateIndex(
                name: "IX_Businesses_StateCode_CountryCode",
                table: "Businesses",
                columns: new[] { "StateCode", "CountryCode" });

            migrationBuilder.AddForeignKey(
                name: "FK_Businesses_LocationCities_CityCode",
                table: "Businesses",
                column: "CityCode",
                principalTable: "LocationCities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Businesses_LocationCountries_CountryCode",
                table: "Businesses",
                column: "CountryCode",
                principalTable: "LocationCountries",
                principalColumn: "ISOCode",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Businesses_LocationStates_StateCode_CountryCode",
                table: "Businesses",
                columns: new[] { "StateCode", "CountryCode" },
                principalTable: "LocationStates",
                principalColumns: new[] { "Code", "CountryCode" },
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Businesses_LocationCities_CityCode",
                table: "Businesses");

            migrationBuilder.DropForeignKey(
                name: "FK_Businesses_LocationCountries_CountryCode",
                table: "Businesses");

            migrationBuilder.DropForeignKey(
                name: "FK_Businesses_LocationStates_StateCode_CountryCode",
                table: "Businesses");

            migrationBuilder.DropTable(
                name: "LocationCities");

            migrationBuilder.DropTable(
                name: "LocationCountries");

            migrationBuilder.DropTable(
                name: "LocationStates");

            migrationBuilder.DropTable(
                name: "LocationTimeZones");

            migrationBuilder.DropIndex(
                name: "IX_Businesses_CityCode",
                table: "Businesses");

            migrationBuilder.DropIndex(
                name: "IX_Businesses_CountryCode",
                table: "Businesses");

            migrationBuilder.DropIndex(
                name: "IX_Businesses_StateCode_CountryCode",
                table: "Businesses");

            migrationBuilder.DropColumn(
                name: "Address",
                table: "Businesses");

            migrationBuilder.DropColumn(
                name: "AddressNumber",
                table: "Businesses");

            migrationBuilder.DropColumn(
                name: "CityCode",
                table: "Businesses");

            migrationBuilder.DropColumn(
                name: "CountryCode",
                table: "Businesses");

            migrationBuilder.DropColumn(
                name: "StateCode",
                table: "Businesses");
        }
    }
}
