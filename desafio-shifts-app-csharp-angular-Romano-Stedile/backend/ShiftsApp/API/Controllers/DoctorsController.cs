using API.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DoctorsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Doctor>>> GetDoctors()
        {
            return await _context.Doctors.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Doctor>> GetDoctor(long id)
        {
            var doctor = Doctor.GetById(id, _context);

            if (doctor == null)
            {
                return NotFound();
            }

            return doctor;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutDoctor(long id, Doctor doctor)
        {
            if (id != doctor.Id)
            {
                return BadRequest();
            }

            if (!DoctorExists(id))
            {
                return NotFound();
            }

            try
            {
                Doctor.Update(id, doctor, _context);
            }
            catch (InvalidOperationException)
            {
                return BadRequest();
            }

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<Doctor>> PostDoctor(Doctor doctor)
        {
            try
            {
                Doctor.Create(doctor, _context);
            }
            catch (InvalidOperationException)
            {
                return BadRequest();
            }

            return CreatedAtAction("GetDoctor", new { id = doctor.Id }, doctor);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDoctor(long id)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null)
            {
                return NotFound();
            }

            _context.Doctors.Remove(doctor);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DoctorExists(long id)
        {
            return _context.Doctors.Any(e => e.Id == id);
        }
    }
}
