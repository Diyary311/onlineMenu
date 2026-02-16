using Microsoft.EntityFrameworkCore;
using onlineMenu.Model;


namespace onlineMenu.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Category> Categories { get; set; }
        public DbSet<FoodItem> FoodItems { get; set; }

        public DbSet<DrinkCategory> DrinkCategories { get; set; }
        public DbSet<DrinkItem> DrinkItems { get; set; }

        public DbSet<SweetCategory> SweetCategories { get; set; }
        public DbSet<SweetItem> SweetItems { get; set; }

        public DbSet<User> Users { get; set; }
    }
}
