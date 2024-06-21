using ScheduleAppBackend.Models;
using System.Text.Json.Serialization;

namespace ScheduleAppBackend.Types
{
    public class NotificationBase
    {
        public int Id { get; set; }
        [JsonIgnore]
        public Guid OwnerId { get; set; }
        public string Heading { get; set; }
        public string Message { get; set; }
        public bool WasVisualized { get; set; }
        public DateTime Time { get; set; }
    }

    public class UAppointmentConfirmedNotificationInfo
    {
        public User User { get; set; }
        public string BusinessName { get; set; }
        public int AppointmentTime { get; set; }
    }

    public class BNewAppointmentNotificationInfo
    {
        public User User { get; set; }
        public Business Business { get; set; }
        public BusinessService Service { get; set; }
        public int AppointmentTime { get; set; }
    }
}
