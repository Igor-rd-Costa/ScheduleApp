using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ScheduleAppBackend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    FirstName = table.Column<string>(type: "text", nullable: false),
                    LastName = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "character varying(320)", maxLength: 320, nullable: false),
                    IsEmailConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    ProfileUrl = table.Column<string>(type: "text", nullable: false),
                    Password = table.Column<string>(type: "text", nullable: false),
                    LastEditDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Businesses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    OwnerId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    BusinessUrl = table.Column<string>(type: "character varying(60)", maxLength: 60, nullable: false),
                    LastEditDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Businesses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Businesses_Users_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BusinessEmployees",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false),
                    EmployeeId = table.Column<Guid>(type: "uuid", nullable: false),
                    BusinessId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BusinessEmployees", x => new { x.Id, x.EmployeeId });
                    table.ForeignKey(
                        name: "FK_BusinessEmployees_Businesses_BusinessId",
                        column: x => x.BusinessId,
                        principalTable: "Businesses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BusinessEmployees_Users_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BusinessEmployeesHours",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false),
                    EmployeeId = table.Column<Guid>(type: "uuid", nullable: false),
                    BusinessId = table.Column<Guid>(type: "uuid", nullable: false),
                    StartTime = table.Column<int>(type: "integer", nullable: false),
                    EndTime = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BusinessEmployeesHours", x => new { x.Id, x.EmployeeId });
                    table.ForeignKey(
                        name: "FK_BusinessEmployeesHours_Businesses_BusinessId",
                        column: x => x.BusinessId,
                        principalTable: "Businesses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BusinessEmployeesHours_Users_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BusinessesHours",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false),
                    BusinessId = table.Column<Guid>(type: "uuid", nullable: false),
                    Day = table.Column<int>(type: "integer", nullable: false),
                    IntervalStart = table.Column<int>(type: "integer", nullable: false),
                    IntervalEnd = table.Column<int>(type: "integer", nullable: false),
                    LastEditDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BusinessesHours", x => new { x.Id, x.BusinessId });
                    table.ForeignKey(
                        name: "FK_BusinessesHours_Businesses_BusinessId",
                        column: x => x.BusinessId,
                        principalTable: "Businesses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BusinessesServicesCategories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false),
                    BusinessId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    LastEditDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BusinessesServicesCategories", x => new { x.Id, x.BusinessId });
                    table.ForeignKey(
                        name: "FK_BusinessesServicesCategories_Businesses_BusinessId",
                        column: x => x.BusinessId,
                        principalTable: "Businesses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BusinessesServices",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false),
                    BusinessId = table.Column<Guid>(type: "uuid", nullable: false),
                    CategoryId = table.Column<int>(type: "integer", nullable: true),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    Price = table.Column<decimal>(type: "numeric", nullable: true),
                    Duration = table.Column<int>(type: "integer", nullable: false),
                    LastEditDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BusinessesServices", x => new { x.Id, x.BusinessId });
                    table.ForeignKey(
                        name: "FK_BusinessesServices_BusinessesServicesCategories_CategoryId_~",
                        columns: x => new { x.CategoryId, x.BusinessId },
                        principalTable: "BusinessesServicesCategories",
                        principalColumns: new[] { "Id", "BusinessId" });
                    table.ForeignKey(
                        name: "FK_BusinessesServices_Businesses_BusinessId",
                        column: x => x.BusinessId,
                        principalTable: "Businesses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Appointments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false),
                    ClientId = table.Column<Guid>(type: "uuid", nullable: false),
                    BusinessId = table.Column<Guid>(type: "uuid", nullable: false),
                    EmployeeId = table.Column<Guid>(type: "uuid", nullable: false),
                    ServiceId = table.Column<int>(type: "integer", nullable: false),
                    Time = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Appointments", x => new { x.Id, x.ClientId });
                    table.ForeignKey(
                        name: "FK_Appointments_BusinessesServices_ServiceId_BusinessId",
                        columns: x => new { x.ServiceId, x.BusinessId },
                        principalTable: "BusinessesServices",
                        principalColumns: new[] { "Id", "BusinessId" },
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Appointments_Businesses_BusinessId",
                        column: x => x.BusinessId,
                        principalTable: "Businesses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Appointments_Users_ClientId",
                        column: x => x.ClientId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Appointments_Users_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_BusinessId",
                table: "Appointments",
                column: "BusinessId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_ClientId",
                table: "Appointments",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_EmployeeId",
                table: "Appointments",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_ServiceId_BusinessId",
                table: "Appointments",
                columns: new[] { "ServiceId", "BusinessId" });

            migrationBuilder.CreateIndex(
                name: "IX_BusinessEmployees_BusinessId",
                table: "BusinessEmployees",
                column: "BusinessId");

            migrationBuilder.CreateIndex(
                name: "IX_BusinessEmployees_EmployeeId",
                table: "BusinessEmployees",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_BusinessEmployeesHours_BusinessId",
                table: "BusinessEmployeesHours",
                column: "BusinessId");

            migrationBuilder.CreateIndex(
                name: "IX_BusinessEmployeesHours_EmployeeId",
                table: "BusinessEmployeesHours",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_Businesses_OwnerId",
                table: "Businesses",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_BusinessesHours_BusinessId",
                table: "BusinessesHours",
                column: "BusinessId");

            migrationBuilder.CreateIndex(
                name: "IX_BusinessesServices_BusinessId",
                table: "BusinessesServices",
                column: "BusinessId");

            migrationBuilder.CreateIndex(
                name: "IX_BusinessesServices_CategoryId_BusinessId",
                table: "BusinessesServices",
                columns: new[] { "CategoryId", "BusinessId" });

            migrationBuilder.CreateIndex(
                name: "IX_BusinessesServicesCategories_BusinessId",
                table: "BusinessesServicesCategories",
                column: "BusinessId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Appointments");

            migrationBuilder.DropTable(
                name: "BusinessEmployees");

            migrationBuilder.DropTable(
                name: "BusinessEmployeesHours");

            migrationBuilder.DropTable(
                name: "BusinessesHours");

            migrationBuilder.DropTable(
                name: "BusinessesServices");

            migrationBuilder.DropTable(
                name: "BusinessesServicesCategories");

            migrationBuilder.DropTable(
                name: "Businesses");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
