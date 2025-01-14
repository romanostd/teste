using API.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShiftsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly Configuration _configuration;

        public ShiftsController(ApplicationDbContext context, Configuration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public class ShiftDTO
        {
            public long? Id { get; set; }
            public long DoctorId { get; set; }
            public long HospitalId { get; set; }
            public string Specialty { get; set; }
            public DateTime Begin { get; set; }
            public DateTime End { get; set; }

            public Shift ToShift()
            {
                return new()
                {
                    Id = Id ?? 0,
                    DoctorId = DoctorId,
                    HospitalId = HospitalId,
                    Specialty = Specialty,
                    Begin = Begin,
                    End = End,

                };
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Shift>>> GetShifts()
        {
            return await _context.Shifts.Include(s => s.Hospital).Include(s => s.Doctor).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Shift>> GetShift(long id)
        {
            var shift = await _context.Shifts.Include(s => s.Hospital).Include(s => s.Doctor).FirstOrDefaultAsync(s => s.Id == id);

            if (shift == null)
            {
                return NotFound();
            }

            return shift;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutShift(long id, Shift shift)
        {
            if (id != shift.Id)
            {
                return BadRequest();
            }

            _context.Entry(shift).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ShiftExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<Shift>> PostShift(ShiftDTO shiftDTO)
        {
            var shift = shiftDTO.ToShift();
            var shiftIntervalMinutes = (shift.End - shift.Begin).TotalMinutes;
            if (shiftIntervalMinutes < 60)
            {
                return BadRequest("Shift cannot be smaller than 1 hour.");
            }
            if (shiftIntervalMinutes > 720)
            {
                return BadRequest("Shift cannot be greater than 12 hours.");
            }
            if (_configuration.GetSlotTimeMinutes() > 60 && shiftIntervalMinutes < _configuration.GetSlotTimeMinutes())
            {
                return BadRequest($"Shift cannot be smaller than {_configuration.GetSlotTimeMinutes()} minutes.");
            }

            var doctorShifts = _context.Shifts
                .Where(s => s.Doctor.Id == shift.DoctorId && (s.Begin.Date == shift.Begin.Date || s.Begin.Date == shift.End.Date || s.End.Date == shift.Begin.Date || s.End.Date == shift.End.Date))
                .AsNoTracking()
                .ToList();

            var shiftsByDay = doctorShifts.GroupBy(s => s.Begin.Date)
                .Union(doctorShifts.GroupBy(s => s.End.Date))
                .DistinctBy(s => s.Key)
                .Where(s => (s.Key == shift.Begin.Date || s.Key == shift.End.Date) && s.Count() > _configuration.GetMaxDoctorDayShifts())
                .ToList();

            if (shiftsByDay.Count > 0)
            {
                return BadRequest($"Doctor cannot have more than {_configuration.GetMaxDoctorDayShifts()} shifts in a day.");
            }

            if (shiftIntervalMinutes % _configuration.GetSlotTimeMinutes() > 0)
            {
                return BadRequest($"Shifts must obey intervals of {_configuration.GetSlotTimeMinutes()} minutes.");
            }

            _context.Shifts.Add(shift);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetShift", new { id = shift.Id }, shift);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteShift(long id)
        {
            var shift = await _context.Shifts.FindAsync(id);
            if (shift == null)
            {
                return NotFound();
            }

            _context.Shifts.Remove(shift);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ShiftExists(long id)
        {
            return _context.Shifts.Any(e => e.Id == id);
        }
    }
}
