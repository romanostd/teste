using API.Utils;
using Microsoft.AspNetCore.Mvc;
using static API.Utils.ShiftsCostReport;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ReportsController(ApplicationDbContext context) { 
            _context = context;
        }

        public class ShiftsCostReportRequest
        {
            public long[] HospitalIds { get; set; }
            public DateTime Start { get; set; }
            public DateTime End { get; set; }
        }

        [Route("shift-cost")]
        [HttpPost]
        public IEnumerable<ShiftsCostReportResult> GetShiftsCostReport(ShiftsCostReportRequest request)
        {
            var report = new ShiftsCostReport(_context).GetShiftsCostReport(request.HospitalIds, request.Start, request.End);

            return report;
        }
    }
}
