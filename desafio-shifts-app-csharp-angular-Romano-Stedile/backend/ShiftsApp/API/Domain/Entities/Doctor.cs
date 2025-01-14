using API.Utils;
using Microsoft.EntityFrameworkCore;

namespace API.Domain.Entities
{
    public class Doctor
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string CPF { get; set; }
        public string CRM { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }


        public static Doctor? GetById(long id, ApplicationDbContext dbContext)
        {
            var query = "select * from doctors where id = "
            + id
            + ";";
            return dbContext.Doctors.FromSqlRaw(query).FirstOrDefault();
        }

        public static Doctor Create(Doctor doctor, ApplicationDbContext dbContext)
        {
            if (!new ValidateDoctor().Validate(null, doctor, dbContext))
            {
                throw new InvalidOperationException("Doctor is not valid");
            }

            dbContext.Doctors.Add(doctor);
            dbContext.SaveChanges();

            return doctor;
        }

        public static Doctor Update(long id, Doctor doctor, ApplicationDbContext dbContext)
        {
            if (!new ValidateDoctor().Validate(id, doctor, dbContext))
            {
                throw new InvalidOperationException("Doctor is not valid");
            }

            dbContext.Doctors.Update(doctor);
            dbContext.SaveChanges();

            return doctor;
        }
    }
}
