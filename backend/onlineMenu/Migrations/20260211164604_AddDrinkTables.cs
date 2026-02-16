using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace onlineMenu.Migrations
{
    /// <inheritdoc />
    public partial class AddDrinkTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DrinkCategories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DrinkCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DrinkItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Price = table.Column<double>(type: "float", nullable: false),
                    Size = table.Column<double>(type: "float", nullable: false),
                    TypeOfMoney = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DrinkItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DrinkItems_DrinkCategories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "DrinkCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DrinkItems_CategoryId",
                table: "DrinkItems",
                column: "CategoryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DrinkItems");

            migrationBuilder.DropTable(
                name: "DrinkCategories");
        }
    }
}
