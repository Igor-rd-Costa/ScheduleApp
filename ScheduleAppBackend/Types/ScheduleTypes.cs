namespace ScheduleAppBackend.Types
{
    public class ScheduleData
    {
        public int ServiceId { get; set; }
        public Guid BusinessId { get; set; }
        public Guid EmployeeId { get; set; }
        public int Time { get; set; } 
    }

    public class AppointmentInfo
    {
        public int Id { get; set; }
        public Guid ClientId {  get; set; }
        public string BusinessName { get; set; } = "";
        public string EmployeeName { get; set; } = "";
        public string ServiceName { get; set; } = "";
        public decimal Price { get; set; }
        public ushort Duration { get; set; }
        public int Time { get; set; }
    }
}
