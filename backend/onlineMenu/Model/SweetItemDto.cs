using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace onlineMenu.Model
{
    public class SweetItemDto
    {
        [Required]
        public string Name { get; set; }

        public int CategoryId { get; set; }

        public IFormFile? Image { get; set; }

        [Required]
        public double Price { get; set; }

        public double Size { get; set; }

        public string TypeOfMoney { get; set; } = "دینار";
    }
}
