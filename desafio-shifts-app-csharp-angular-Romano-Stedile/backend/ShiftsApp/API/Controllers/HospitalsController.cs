using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Domain.Entities;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HospitalsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public HospitalsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Hospital>>> GetHospitals()
        {
            return await _context.Hospitals.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Hospital>> GetHospital(long id)
        {
            var query = "select * from hospitals where id = "
                + id
                + ";";
            var hospital = _context.Hospitals.FromSqlRaw(query).FirstOrDefault();

            if (hospital == null)
            {
                return NotFound();
            }

            return hospital;
        }

        
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHospital(long id, Hospital hospital)
        {
            if (id != hospital.Id)
            {
                return BadRequest();
            }

            _context.Entry(hospital).State = EntityState.Modified;

            await _context.SaveChangesAsync();
            

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<Hospital>> PostHospital(Hospital hospital)
        {

            var query = "select * from hospitals where name = '"
                + hospital.Name
                + "';";
            var existingWithName = _context.Hospitals.FromSqlRaw(query).ToList();

            if (existingWithName.Any())
            {
                return BadRequest("Hospital already exists");
            }

            _context.Hospitals.Add(hospital);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHospital(long id)
        {
            var hospital = await _context.Hospitals.FindAsync(id);
            if (hospital == null)
            {
                return NotFound();
            }

            _context.Hospitals.Remove(hospital);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}
