using System.ComponentModel.DataAnnotations;

namespace onlineMenu.Model
{
    public class DrinkCategory
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public ICollection<DrinkItem> DrinkItems { get; set; }
    }
}
