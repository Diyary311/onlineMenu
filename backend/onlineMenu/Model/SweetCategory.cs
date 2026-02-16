using System.ComponentModel.DataAnnotations;

namespace onlineMenu.Model
{
    public class SweetCategory
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public ICollection<SweetItem> SweetItems { get; set; }
    }
}
