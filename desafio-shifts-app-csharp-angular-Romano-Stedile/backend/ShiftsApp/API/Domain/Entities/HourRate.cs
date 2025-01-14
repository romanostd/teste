namespace API.Domain.Entities
{
    public class HourRate
    {
        public static readonly decimal DefaultHourRate = 100;

        public static readonly Dictionary<string, decimal> SpecialtyHourRates = new()
        {
            {"Generalista", DefaultHourRate },
            {"Pediatria", DefaultHourRate },
            {"Geriatria", DefaultHourRate },
            {"Cardiologia", DefaultHourRate },
            {"Neurologia", 125 },
            {"Cirurgia", 123 },
            {"Obstetricia", 114 },
            {"Imunologia", 110 },
            {"Dermatologia", DefaultHourRate },
            {"Urologia", 115.25m },
        };
    }
}
