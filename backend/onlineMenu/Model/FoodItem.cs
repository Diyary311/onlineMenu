using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace onlineMenu.Model
{
    public class FoodItem
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public string ImageUrl { get; set; }

        [Required]
        public double Price { get; set; }

        public double Size { get; set; }

        public string TypeOfMoney { get; set; } = "دینار";

        // ✅ Foreign Key
        public int CategoryId { get; set; }

        // ✅ Navigation Property
        [ForeignKey(nameof(CategoryId))]
        public Category CategoryNavigation { get; set; }
    }
}
