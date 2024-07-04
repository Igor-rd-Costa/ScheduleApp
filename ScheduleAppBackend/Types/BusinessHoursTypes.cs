namespace ScheduleAppBackend.Types
{
    public class BusinessHourCreateInfo
    {
        public DayOfWeek Day { get; set; }
        public ushort IntervalStart { get; set; }
        public ushort IntervalEnd { get; set; }
    }

    public class BusinessHourUpdateInfo
    {
        public int Id { get; set; }
        public DayOfWeek Day { get; set; }
        public ushort IntervalStart { get; set; }
        public ushort IntervalEnd { get; set; }
    }

    public class BusinessHoursUpdateInfo
    {
        public List<BusinessHourCreateInfo> CreateInfo { get; set; } = [];
        public List<BusinessHourUpdateInfo> UpdateInfo { get; set; } = [];
        public List<int> DeleteInfo { get; set; } = [];
    }

    public class BusinessHourDeleteInfo
    {
        public int Id { get; set; }
    }
}
