using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using onlineMenu.Data;
using onlineMenu.Model;

namespace onlineMenu.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DrinkCategoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DrinkCategoryController(AppDbContext context)
        {
            _context = context;
        }

        // GET api/drinkcategory
        [HttpGet]
        public IActionResult GetCategories()
        {
            var categories = _context.DrinkCategories.ToList();
            return Ok(categories);
        }

        // POST api/drinkcategory
        [HttpPost]
        public async Task<IActionResult> CreateCategory([FromBody] DrinkCategoryDto categoryDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var category = new DrinkCategory
            {
                Name = categoryDto.Name
            };

            _context.DrinkCategories.Add(category);
            await _context.SaveChangesAsync();

            return Ok(category);
        }

        // DELETE api/drinkcategory/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.DrinkCategories
                .Include(c => c.DrinkItems)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
                return NotFound();

            if (category.DrinkItems.Any())
                return BadRequest("Cannot delete category that has drink items.");

            _context.DrinkCategories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT api/drinkcategory/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromForm] DrinkCategoryDto dto)
        {
            try
            {
                var ctg_update = await _context.DrinkCategories.FindAsync(id);

                if (ctg_update == null)
                {
                    return NotFound($"this category are not found{id}");
                }

                if (!string.IsNullOrWhiteSpace(dto.Name) || !string.IsNullOrEmpty(dto.Name))
                {
                    ctg_update.Name = dto.Name;
                }
                else
                {
                    return NotFound($"name can not be white space or empty{dto.Name}");
                }
                await _context.SaveChangesAsync();
                return Ok(ctg_update);
            }
            catch
            {
                return StatusCode(500, $"internal server error");
            }
        }
    }
}
