namespace API.Domain.Entities
{
    public class Shift
    {
        public long Id { get; set; }

        public Doctor Doctor { get; set; }
        public long DoctorId { get; set; }
        public Hospital Hospital { get; set; }
        public long HospitalId { get; set; }
        public string Specialty { get; set; }
        public DateTime Begin { get; set; }
        public DateTime End { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
