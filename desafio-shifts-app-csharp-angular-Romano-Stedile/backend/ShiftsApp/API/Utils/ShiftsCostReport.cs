using API.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Utils
{
    public class ShiftsCostReport
    {
        public class ShiftsCostReportResult
        {
            public long HospitalId {  get; set; }
            public string HospitalName { get; set; }
            public int ShiftsCount { get; set; }
            public decimal Amount { get; set; }
            public DateTime ReportStartDate { get; set; }
            public DateTime ReportEndDate { get; set; }
        }

        private readonly ApplicationDbContext _dbContext;
        public ShiftsCostReport(ApplicationDbContext dbContext) { 
            _dbContext = dbContext;
        }

        public List<ShiftsCostReportResult> GetShiftsCostReport(long[] hospitalIds, DateTime start, DateTime end)
        {
            var query = from shift in _dbContext.Shifts.Include(s => s.Hospital)
                        where hospitalIds.Contains(shift.Hospital.Id) && shift.Begin.Date >= start && shift.End.Date <= end
                        group shift by shift.Hospital.Id into g
                        select new ShiftsCostReportResult()
                        {
                            HospitalId = g.First().Hospital.Id,
                            HospitalName = g.First().Hospital.Name,
                            ShiftsCount = g.Count(),
                            Amount = SumShiftsByHourRate(g.ToList()),
                            ReportStartDate = start,
                            ReportEndDate = end,
                            
                        };

            return query.AsNoTracking().ToList();
        }

        private static decimal SumShiftsByHourRate(List<Shift> shifts)
        {
            return shifts.Sum(s => (decimal)(s.End - s.Begin).TotalHours * HourRate.SpecialtyHourRates.GetValueOrDefault(s.Specialty, HourRate.DefaultHourRate));
        }
    }
}
