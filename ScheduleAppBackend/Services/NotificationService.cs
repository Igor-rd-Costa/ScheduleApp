using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ScheduleAppBackend.Context;
using ScheduleAppBackend.Models;
using ScheduleAppBackend.Services.Interfaces;
using ScheduleAppBackend.Types;

namespace ScheduleAppBackend.Services
{
    public class NotificationService : INotificationService
    {
        private readonly ScheduleAppContext m_Context;

        public NotificationService(ScheduleAppContext context, UserManager<User> userManager)
        {
            m_Context = context;
        }

        public bool CreateUserAppointmentConfirmedNotification(UAppointmentConfirmedNotificationInfo info)
        {
            DateTime now = DateTime.UtcNow;
            UserNotification userNotification = new()
            {
                Id = new Random().Next(),
                OwnerId = info.User.Id,
                Heading = "Appointment confirmed",
                Message = $"{info.BusinessName}\t{info.AppointmentTime}",
                WasVisualized = false,
                Time = now
            };

            var state = m_Context.UserNotifications.Add(userNotification).State;
            if (state == EntityState.Added)
            {
                info.User.HasUnseenNotifications = true;
                info.User.LastEditDate = now;
                state = m_Context.Users.Update(info.User).State;
                if (state == EntityState.Modified)
                    return true;
            }
            return false;
        }

        public bool CreateBusinessNewAppointmentNotification(BNewAppointmentNotificationInfo info)
        {
            DateTime now = DateTime.UtcNow;
            BusinessNotification businessNotification = new()
            {
                Id = new Random().Next(),
                OwnerId = info.Business.Id,
                Heading = "New appointment",
                Message = $"{info.User.FirstName} {info.User.LastName}\t{info.Service.Name}\t{info.AppointmentTime}",
                WasVisualized = false,
                Time = now
            };

            var state = m_Context.BusinessNotifications.Add(businessNotification).State;
            if (state == EntityState.Added)
            {
                info.Business.HasUnseenNotifications = true;
                info.Business.LastEditDate = now;
                state = m_Context.Businesses.Update(info.Business).State;
                if (state == EntityState.Modified)
                    return true;
            }
            return false;
        }
    }
}
