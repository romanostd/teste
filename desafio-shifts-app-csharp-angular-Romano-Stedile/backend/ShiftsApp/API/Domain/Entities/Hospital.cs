namespace API.Domain.Entities
{
    public class Hospital
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
