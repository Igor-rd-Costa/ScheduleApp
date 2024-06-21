using ScheduleAppBackend.Models;
using ScheduleAppBackend.Types;

namespace ScheduleAppBackend.Services.Interfaces
{
    public interface INotificationService
    {
        public bool CreateUserAppointmentConfirmedNotification(UAppointmentConfirmedNotificationInfo info);
        public bool CreateBusinessNewAppointmentNotification(BNewAppointmentNotificationInfo info);
    }
}
