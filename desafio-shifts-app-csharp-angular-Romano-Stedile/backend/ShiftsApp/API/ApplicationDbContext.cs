using API.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace API
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Doctor> Doctors { get; set; }

        public DbSet<Hospital> Hospitals { get; set; }

        public DbSet<Shift> Shifts { get; set; }
    }
}
