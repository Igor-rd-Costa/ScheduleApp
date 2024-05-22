using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ScheduleAppBackend.Migrations
{
    /// <inheritdoc />
    public partial class BusinessesServicesCategories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                table: "BusinessesServices",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "BusinessesServicesCategories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    BusinessId = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BusinessesServicesCategories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BusinessesServicesCategories_Businesses_BusinessId",
                        column: x => x.BusinessId,
                        principalTable: "Businesses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BusinessesServices_CategoryId",
                table: "BusinessesServices",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_BusinessesServicesCategories_BusinessId",
                table: "BusinessesServicesCategories",
                column: "BusinessId");

            migrationBuilder.AddForeignKey(
                name: "FK_BusinessesServices_BusinessesServicesCategories_CategoryId",
                table: "BusinessesServices",
                column: "CategoryId",
                principalTable: "BusinessesServicesCategories",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BusinessesServices_BusinessesServicesCategories_CategoryId",
                table: "BusinessesServices");

            migrationBuilder.DropTable(
                name: "BusinessesServicesCategories");

            migrationBuilder.DropIndex(
                name: "IX_BusinessesServices_CategoryId",
                table: "BusinessesServices");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "BusinessesServices");
        }
    }
}
