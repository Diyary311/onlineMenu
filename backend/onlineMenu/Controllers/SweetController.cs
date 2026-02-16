using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using onlineMenu.Data;
using onlineMenu.Model;

namespace onlineMenu.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SweetController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public SweetController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: api/sweet
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SweetItemResponseDto>>> GetSweets()
        {
            var sweets = await _context.SweetItems
                .Include(s => s.CategoryNavigation)
                .Select(s => new SweetItemResponseDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Price = s.Price,
                    Size = s.Size,
                    TypeOfMoney = s.TypeOfMoney,
                    ImageUrl = s.ImageUrl,
                    CategoryId = s.CategoryId,
                    CategoryName = s.CategoryNavigation != null ? s.CategoryNavigation.Name : ""
                })
                .ToListAsync();

            return Ok(sweets);
        }

        // POST: api/sweet
        [HttpPost]
        public async Task<IActionResult> AddSweet([FromForm] SweetItemDto dto)
        {
            string imageUrl = "";

            if (dto.Image != null)
            {
                var uploadsFolder = Path.Combine(_env.WebRootPath, "Images");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.Image.FileName);
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.Image.CopyToAsync(stream);
                }

                imageUrl = "/Images/" + uniqueFileName;
            }

            var sweet = new SweetItem
            {
                Name = dto.Name,
                Price = dto.Price,
                Size = dto.Size,
                TypeOfMoney = dto.TypeOfMoney,
                ImageUrl = imageUrl,
                CategoryId = dto.CategoryId
            };

            _context.SweetItems.Add(sweet);
            await _context.SaveChangesAsync();

            return Ok("Sweet added successfully");
        }

        // PUT: api/sweet/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSweet(int id, [FromForm] SweetItemDto dto)
        {
            var sweet = await _context.SweetItems.FindAsync(id);
            if (sweet == null)
                return NotFound("Sweet not found");

            sweet.Name = dto.Name;
            sweet.Price = dto.Price;
            sweet.Size = dto.Size;
            sweet.TypeOfMoney = dto.TypeOfMoney;
            sweet.CategoryId = dto.CategoryId;

            if (dto.Image != null)
            {
                // Delete old image if exists
                if (!string.IsNullOrEmpty(sweet.ImageUrl))
                {
                    var oldPath = Path.Combine(_env.WebRootPath, sweet.ImageUrl.TrimStart('/'));
                    if (System.IO.File.Exists(oldPath))
                        System.IO.File.Delete(oldPath);
                }

                var uploadsFolder = Path.Combine(_env.WebRootPath, "Images");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.Image.FileName);
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.Image.CopyToAsync(stream);
                }

                sweet.ImageUrl = "/Images/" + uniqueFileName;
            }

            await _context.SaveChangesAsync();
            return Ok(sweet);
        }

        // DELETE: api/sweet/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSweet(int id)
        {
            var sweet = await _context.SweetItems.FindAsync(id);
            if (sweet == null)
                return NotFound("Sweet not found");

            // Delete image file if exists
            if (!string.IsNullOrEmpty(sweet.ImageUrl))
            {
                var imagePath = Path.Combine(_env.WebRootPath, sweet.ImageUrl.TrimStart('/'));
                if (System.IO.File.Exists(imagePath))
                    System.IO.File.Delete(imagePath);
            }

            _context.SweetItems.Remove(sweet);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
