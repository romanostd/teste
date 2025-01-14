namespace API
{
    public class Configuration
    {
        private readonly IConfiguration configuration;
        public Configuration(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        public Dictionary<string, string?> GetAll()
        {
            return configuration.GetSection("App").GetChildren().ToDictionary(x => x.Key, x => x.Value);
        }

        public int GetSlotTimeMinutes()
        {
            var slotTimeMinutes = configuration.GetSection("App").GetValue<int?>("SlotTimeMinutes") ?? throw new InvalidOperationException("App config 'SlotTimeMinutes' not found.");
            return slotTimeMinutes;
        }

        public int GetMaxDoctorDayShifts()
        {
            var maxDoctorDayShifts = configuration.GetSection("App").GetValue<int?>("MaxDoctorDayShifts") ?? throw new InvalidOperationException("App config 'MaxDoctorDayShifts' not found.");
            return maxDoctorDayShifts;
        }
    }
}
