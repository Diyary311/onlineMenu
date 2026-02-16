using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using onlineMenu.Data;
using onlineMenu.Model;

namespace onlineMenu.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SweetCategoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SweetCategoryController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/sweetcategory
        [HttpGet]
        public IActionResult GetCategories()
        {
            var categories = _context.SweetCategories.ToList();
            return Ok(categories);
        }

        // POST: api/sweetcategory
        [HttpPost]
        public async Task<IActionResult> AddCategory([FromBody] SweetCategoryDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest("Category name is required");

            var category = new SweetCategory
            {
                Name = dto.Name
            };

            _context.SweetCategories.Add(category);
            await _context.SaveChangesAsync();

            return Ok(category);
        }

        // PUT: api/sweetcategory/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromForm] SweetCategoryDto dto)
        {
            var category = await _context.SweetCategories.FindAsync(id);
            if (category == null)
                return NotFound("Sweet category not found");

            category.Name = dto.Name;
            await _context.SaveChangesAsync();

            return Ok(category);
        }

        // DELETE: api/sweetcategory/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.SweetCategories
                .Include(c => c.SweetItems)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
                return NotFound("Sweet category not found");

            if (category.SweetItems != null && category.SweetItems.Any())
                return BadRequest("Cannot delete category with existing sweet items. Remove items first.");

            _context.SweetCategories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
