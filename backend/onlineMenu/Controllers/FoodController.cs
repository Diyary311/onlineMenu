using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using onlineMenu.Data;
using onlineMenu.Model;

namespace onlineMenu.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class FoodController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public FoodController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // ✅ ADD FOOD
        [HttpPost]
        public async Task<IActionResult> AddFood([FromForm] FoodItemDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var category = await _context.Categories
                .FirstOrDefaultAsync(c => c.Id == dto.CategoryId);

            if (category == null)
            {
                var validIds = await _context.Categories.Select(c => c.Id).ToListAsync();
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

            var food = new FoodItem
            {
                Name = dto.Name,
                Price = dto.Price,
                Size = dto.Size,
                TypeOfMoney = dto.TypeOfMoney,
                ImageUrl = imagePath,
                CategoryId = dto.CategoryId
            };

            _context.FoodItems.Add(food);
            await _context.SaveChangesAsync();

            return Ok("Food added successfully");
        }
        // ✅ DELETE FOOD
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFood(int id)
        {
            var food = await _context.FoodItems.FindAsync(id);

            if (food == null)
            {
                return NotFound($"Food item with ID {id} not found");
            }

            // Optionally delete the image file
            if (!string.IsNullOrEmpty(food.ImageUrl))
            {
                var imagePath = Path.Combine(_env.WebRootPath, food.ImageUrl.TrimStart('/'));
                if (System.IO.File.Exists(imagePath))
                {
                    System.IO.File.Delete(imagePath);
                }
            }

            _context.FoodItems.Remove(food);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ✅ GET ALL FOODS
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FoodItemResponseDto>>> GetFoods()
        {
            var foods = await _context.FoodItems
                .Include(f => f.CategoryNavigation)
                .Select(f => new FoodItemResponseDto
                {
                    Id = f.Id,
                    Name = f.Name,
                    Price = f.Price,
                    Size = f.Size,
                    TypeOfMoney = f.TypeOfMoney,
                    ImageUrl = f.ImageUrl,
                    CategoryId = f.CategoryId,
                    CategoryName = f.CategoryNavigation.Name
                })
                .ToListAsync();

            return Ok(foods);
        }
    }
}
