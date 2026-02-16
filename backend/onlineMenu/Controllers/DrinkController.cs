using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using onlineMenu.Data;
using onlineMenu.Model;

namespace onlineMenu.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DrinkController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public DrinkController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // ✅ GET ALL DRINKS
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DrinkItemResponseDto>>> GetDrinks()
        {
            var drinks = await _context.DrinkItems
                .Include(d => d.CategoryNavigation)
                .Select(d => new DrinkItemResponseDto
                {
                    Id = d.Id,
                    Name = d.Name,
                    Price = d.Price,
                    Size = d.Size,
                    TypeOfMoney = d.TypeOfMoney,
                    ImageUrl = d.ImageUrl,
                    CategoryId = d.CategoryId,
                    CategoryName = d.CategoryNavigation.Name
                })
                .ToListAsync();

            return Ok(drinks);
        }

        // ✅ ADD DRINK
        [HttpPost]
        public async Task<IActionResult> AddDrink([FromForm] DrinkItemDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var category = await _context.DrinkCategories
                .FirstOrDefaultAsync(c => c.Id == dto.CategoryId);

            if (category == null)
            {
                var validIds = await _context.DrinkCategories.Select(c => c.Id).ToListAsync();
                return BadRequest(new
                {
                    Error = "Invalid CategoryId",
                    ValidCategoryIds = validIds
                });
            }

            string imagePath = null;

            if (dto.Image != null)
            {
                var folderPath = Path.Combine(_env.WebRootPath, "Images");
                Directory.CreateDirectory(folderPath);

                var fileName = Guid.NewGuid() + Path.GetExtension(dto.Image.FileName);
                var fullPath = Path.Combine(folderPath, fileName);

                using var stream = new FileStream(fullPath, FileMode.Create);
                await dto.Image.CopyToAsync(stream);

                imagePath = "/Images/" + fileName;
            }

            var drink = new DrinkItem
            {
                Name = dto.Name,
                Price = dto.Price,
                Size = dto.Size,
                TypeOfMoney = dto.TypeOfMoney,
                ImageUrl = imagePath,
                CategoryId = dto.CategoryId
            };

            _context.DrinkItems.Add(drink);
            await _context.SaveChangesAsync();

            return Ok("Drink added successfully");
        }

        // ✅ DELETE DRINK
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDrink(int id)
        {
            var drink = await _context.DrinkItems.FindAsync(id);

            if (drink == null)
            {
                return NotFound($"Drink item with ID {id} not found");
            }

            // Optionally delete the image file
            if (!string.IsNullOrEmpty(drink.ImageUrl))
            {
                var imagePath = Path.Combine(_env.WebRootPath, drink.ImageUrl.TrimStart('/'));
                if (System.IO.File.Exists(imagePath))
                {
                    System.IO.File.Delete(imagePath);
                }
            }

            _context.DrinkItems.Remove(drink);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ✅ UPDATE DRINK
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDrink(int id, [FromForm] DrinkItemDto dto)
        {
            var drink = await _context.DrinkItems.FindAsync(id);

            if (drink == null)
                return NotFound($"Drink item with ID {id} not found");

            drink.Name = dto.Name;
            drink.Price = dto.Price;
            drink.Size = dto.Size;
            drink.TypeOfMoney = dto.TypeOfMoney;

            if (dto.CategoryId > 0)
            {
                var category = await _context.DrinkCategories.FindAsync(dto.CategoryId);
                if (category == null)
                    return BadRequest("Invalid CategoryId");
                drink.CategoryId = dto.CategoryId;
            }

            if (dto.Image != null)
            {
                // Delete old image
                if (!string.IsNullOrEmpty(drink.ImageUrl))
                {
                    var oldPath = Path.Combine(_env.WebRootPath, drink.ImageUrl.TrimStart('/'));
                    if (System.IO.File.Exists(oldPath))
                        System.IO.File.Delete(oldPath);
                }

                var folderPath = Path.Combine(_env.WebRootPath, "Images");
                Directory.CreateDirectory(folderPath);

                var fileName = Guid.NewGuid() + Path.GetExtension(dto.Image.FileName);
                var fullPath = Path.Combine(folderPath, fileName);

                using var stream = new FileStream(fullPath, FileMode.Create);
                await dto.Image.CopyToAsync(stream);

                drink.ImageUrl = "/Images/" + fileName;
            }

            await _context.SaveChangesAsync();

            var response = new DrinkItemResponseDto
            {
                Id = drink.Id,
                Name = drink.Name,
                Price = drink.Price,
                Size = drink.Size,
                TypeOfMoney = drink.TypeOfMoney,
                ImageUrl = drink.ImageUrl,
                CategoryId = drink.CategoryId,
                CategoryName = (await _context.DrinkCategories.FindAsync(drink.CategoryId))?.Name
            };

            return Ok(response);
        }
    }
}
