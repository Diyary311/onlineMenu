using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;

namespace onlineMenu.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class jwtgen : Controller
    {
        [HttpGet("generate")]
        public IActionResult Generate()
        {
            var randomBytes = new byte[64];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomBytes);
            }
            var key = Convert.ToBase64String(randomBytes);
            return Ok(new { Key = key });
        }
    }
}
