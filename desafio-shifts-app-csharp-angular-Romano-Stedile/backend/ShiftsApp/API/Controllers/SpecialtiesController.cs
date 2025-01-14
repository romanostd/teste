using API.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpecialtiesController : ControllerBase
    {
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return Specialty.Specialties;
        }
    }
}
