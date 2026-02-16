using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using onlineMenu.Data;
using onlineMenu.Model;

[Route("api/[controller]")]
[ApiController]
public class CategoryController : ControllerBase
{
    private readonly AppDbContext _context;

    public CategoryController(AppDbContext context)
    {
        _context = context;
    }

    // GET api/category
    [HttpGet]
    public IActionResult GetCategories()
    {
        var categories = _context.Categories.ToList();
        return Ok(categories);
    }

    // POST api/category
    [HttpPost]
    public async Task<IActionResult> CreateCategory([FromBody] CategoryDto categoryDto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var category = new Category
        {
            Name = categoryDto.Name
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return Ok(category);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var category = await _context.Categories
            .Include(c => c.FoodItems)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null)
            return NotFound();

        if (category.FoodItems.Any())
            return BadRequest("Cannot delete category that has food items.");

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();

        return NoContent();
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCategory(int id, [FromForm] CategoryDto dto)
    {
        try
        {
            var ctg_update = await _context.Categories.FindAsync(id);

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