using onlineMenu.Model;
using System.ComponentModel.DataAnnotations;

namespace onlineMenu.Model
{
    public class Category
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public ICollection<FoodItem> FoodItems { get; set; }
    }
}
