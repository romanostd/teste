using API.Domain.Entities;

namespace API.Utils
{
    public class ValidateDoctor
    {
        public bool Validate(long? docId, Doctor doctor, ApplicationDbContext dbContext)
        {
            var query = from doc in dbContext.Doctors
                        where (!docId.HasValue || doc.Id != docId)
                        && (doc.CPF == doctor.CPF
                        || doc.CRM == doctor.CRM
                        || doc.Email == doctor.Email
                        || doc.Phone == doctor.Phone)
                        select doc.Id;
            if (query.Any()) {
                return false;
            }

            return true;
        }
    }
}
