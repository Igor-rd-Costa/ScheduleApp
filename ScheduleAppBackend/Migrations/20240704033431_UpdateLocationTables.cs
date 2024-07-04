using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ScheduleAppBackend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateLocationTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.DropPrimaryKey(
                name: "PK_LocationTimeZones",
                table: "LocationTimeZones");

            migrationBuilder.DropPrimaryKey(
                name: "PK_LocationStates",
                table: "LocationStates");

            migrationBuilder.DropPrimaryKey(
                name: "PK_LocationCountries",
                table: "LocationCountries");

            migrationBuilder.DropIndex(
                name: "IX_Businesses_CountryCode",
                table: "Businesses");

            migrationBuilder.DropIndex(
                name: "IX_Businesses_StateCode_CountryCode",
                table: "Businesses");

            migrationBuilder.DropColumn(
                name: "Code",
                table: "LocationStates");

            migrationBuilder.DropColumn(
                name: "CountryCode",
                table: "LocationStates");

            migrationBuilder.DropColumn(
                name: "Country",
                table: "LocationCities");

            migrationBuilder.DropColumn(
                name: "State",
                table: "LocationCities");

            migrationBuilder.DropColumn(
                name: "TimeZone",
                table: "LocationCities");

            migrationBuilder.DropColumn(
                name: "CountryCode",
                table: "Businesses");

            migrationBuilder.DropColumn(
                name: "StateCode",
                table: "Businesses");

            migrationBuilder.RenameColumn(
                name: "CityCode",
                table: "Businesses",
                newName: "StateId");

            migrationBuilder.RenameIndex(
                name: "IX_Businesses_CityCode",
                table: "Businesses",
                newName: "IX_Businesses_StateId");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "LocationTimeZones",
                type: "integer",
                nullable: false,
                defaultValue: 0)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "LocationStates",
                type: "integer",
                nullable: false,
                defaultValue: 0)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<int>(
                name: "CountryId",
                table: "LocationStates",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "LocationCountries",
                type: "integer",
                nullable: false,
                defaultValue: 0)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<string>(
                name: "Currency",
                table: "LocationCountries",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "CountryId",
                table: "LocationCities",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "StateId",
                table: "LocationCities",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TimeZoneId",
                table: "LocationCities",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CityId",
                table: "Businesses",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CountryId",
                table: "Businesses",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_LocationTimeZones",
                table: "LocationTimeZones",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_LocationStates",
                table: "LocationStates",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_LocationCountries",
                table: "LocationCountries",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_LocationStates_CountryId",
                table: "LocationStates",
                column: "CountryId");

            migrationBuilder.CreateIndex(
                name: "IX_LocationCities_CountryId",
                table: "LocationCities",
                column: "CountryId");

            migrationBuilder.CreateIndex(
                name: "IX_LocationCities_StateId",
                table: "LocationCities",
                column: "StateId");

            migrationBuilder.CreateIndex(
                name: "IX_LocationCities_TimeZoneId",
                table: "LocationCities",
                column: "TimeZoneId");

            migrationBuilder.CreateIndex(
                name: "IX_Businesses_CityId",
                table: "Businesses",
                column: "CityId");

            migrationBuilder.CreateIndex(
                name: "IX_Businesses_CountryId",
                table: "Businesses",
                column: "CountryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Businesses_LocationCities_CityId",
                table: "Businesses",
                column: "CityId",
                principalTable: "LocationCities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Businesses_LocationCountries_CountryId",
                table: "Businesses",
                column: "CountryId",
                principalTable: "LocationCountries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Businesses_LocationStates_StateId",
                table: "Businesses",
                column: "StateId",
                principalTable: "LocationStates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_LocationCities_LocationCountries_CountryId",
                table: "LocationCities",
                column: "CountryId",
                principalTable: "LocationCountries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_LocationCities_LocationStates_StateId",
                table: "LocationCities",
                column: "StateId",
                principalTable: "LocationStates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_LocationCities_LocationTimeZones_TimeZoneId",
                table: "LocationCities",
                column: "TimeZoneId",
                principalTable: "LocationTimeZones",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_LocationStates_LocationCountries_CountryId",
                table: "LocationStates",
                column: "CountryId",
                principalTable: "LocationCountries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Businesses_LocationCities_CityId",
                table: "Businesses");

            migrationBuilder.DropForeignKey(
                name: "FK_Businesses_LocationCountries_CountryId",
                table: "Businesses");

            migrationBuilder.DropForeignKey(
                name: "FK_Businesses_LocationStates_StateId",
                table: "Businesses");

            migrationBuilder.DropForeignKey(
                name: "FK_LocationCities_LocationCountries_CountryId",
                table: "LocationCities");

            migrationBuilder.DropForeignKey(
                name: "FK_LocationCities_LocationStates_StateId",
                table: "LocationCities");

            migrationBuilder.DropForeignKey(
                name: "FK_LocationCities_LocationTimeZones_TimeZoneId",
                table: "LocationCities");

            migrationBuilder.DropForeignKey(
                name: "FK_LocationStates_LocationCountries_CountryId",
                table: "LocationStates");

            migrationBuilder.DropPrimaryKey(
                name: "PK_LocationTimeZones",
                table: "LocationTimeZones");

            migrationBuilder.DropPrimaryKey(
                name: "PK_LocationStates",
                table: "LocationStates");

            migrationBuilder.DropIndex(
                name: "IX_LocationStates_CountryId",
                table: "LocationStates");

            migrationBuilder.DropPrimaryKey(
                name: "PK_LocationCountries",
                table: "LocationCountries");

            migrationBuilder.DropIndex(
                name: "IX_LocationCities_CountryId",
                table: "LocationCities");

            migrationBuilder.DropIndex(
                name: "IX_LocationCities_StateId",
                table: "LocationCities");

            migrationBuilder.DropIndex(
                name: "IX_LocationCities_TimeZoneId",
                table: "LocationCities");

            migrationBuilder.DropIndex(
                name: "IX_Businesses_CityId",
                table: "Businesses");

            migrationBuilder.DropIndex(
                name: "IX_Businesses_CountryId",
                table: "Businesses");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "LocationTimeZones");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "LocationStates");

            migrationBuilder.DropColumn(
                name: "CountryId",
                table: "LocationStates");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "LocationCountries");

            migrationBuilder.DropColumn(
                name: "Currency",
                table: "LocationCountries");

            migrationBuilder.DropColumn(
                name: "CountryId",
                table: "LocationCities");

            migrationBuilder.DropColumn(
                name: "StateId",
                table: "LocationCities");

            migrationBuilder.DropColumn(
                name: "TimeZoneId",
                table: "LocationCities");

            migrationBuilder.DropColumn(
                name: "CityId",
                table: "Businesses");

            migrationBuilder.DropColumn(
                name: "CountryId",
                table: "Businesses");

            migrationBuilder.RenameColumn(
                name: "StateId",
                table: "Businesses",
                newName: "CityCode");

            migrationBuilder.RenameIndex(
                name: "IX_Businesses_StateId",
                table: "Businesses",
                newName: "IX_Businesses_CityCode");

            migrationBuilder.AddColumn<string>(
                name: "Code",
                table: "LocationStates",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CountryCode",
                table: "LocationStates",
                type: "character varying(2)",
                maxLength: 2,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Country",
                table: "LocationCities",
                type: "character varying(2)",
                maxLength: 2,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "State",
                table: "LocationCities",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TimeZone",
                table: "LocationCities",
                type: "text",
                nullable: false,
                defaultValue: "");

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

            migrationBuilder.AddPrimaryKey(
                name: "PK_LocationTimeZones",
                table: "LocationTimeZones",
                column: "Name");

            migrationBuilder.AddPrimaryKey(
                name: "PK_LocationStates",
                table: "LocationStates",
                columns: new[] { "Code", "CountryCode" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_LocationCountries",
                table: "LocationCountries",
                column: "ISOCode");

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
    }
}
