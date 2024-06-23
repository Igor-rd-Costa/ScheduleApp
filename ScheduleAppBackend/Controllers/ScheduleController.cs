using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScheduleAppBackend.Context;
using ScheduleAppBackend.Helpers;
using ScheduleAppBackend.Models;
using ScheduleAppBackend.Services.Interfaces;
using ScheduleAppBackend.Types;
using System.Linq;

namespace ScheduleAppBackend.Controllers
{
    [Route("api/schedule")]
    [ApiController]
    public class ScheduleController : ControllerBase
    {
        private readonly ScheduleAppContext m_Context;
        private readonly UserManager<User> m_UserManager;
        private readonly INotificationService m_NotificationService;

        public ScheduleController(ScheduleAppContext context, UserManager<User> userManager, INotificationService notificationService)
        {
            m_Context = context;
            m_UserManager = userManager;
            m_NotificationService = notificationService;
        }

        //TODO Add cache
        [HttpGet] 
        public async Task<IActionResult> GetAppointments([FromQuery(Name = "cache")] string cacheString)
        {
            User? user = await m_UserManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized();

            List<Appointment> appointments = m_Context.Appointments.Where(a => a.ClientId == user.Id).ToList();
            List<Appointment> futureAppointments = [];
            Guid businessId = Guid.Empty;
            DateTimeOffset today = new DateTimeOffset(DateTime.UtcNow);
            appointments.Sort((Appointment a, Appointment b) =>
            {
                if (a.BusinessId < b.BusinessId)
                    return -1;
                if (a.BusinessId > b.BusinessId)
                    return 1;
                return 0;
            });
            foreach (Appointment appointment in appointments)
            {
                if (businessId != appointment.BusinessId)
                {
                    businessId = appointment.BusinessId;
                    int cityCode = m_Context.Businesses.Where(b => b.Id == appointment.BusinessId).Select(b => b.CityCode).First();
                    string timezone = m_Context.LocationCities.Where(c => c.Id == cityCode).Select(c => c.TimeZone).First();
                    int tzOffset = m_Context.LocationTimeZones.Where(tz => tz.Name == timezone).Select(tz => tz.Offset).First();
                    today = new DateTimeOffset(DateTime.UtcNow).ToOffset(new TimeSpan(tzOffset, 0, 0));
                }

                SADateTime time = new(appointment.Time);
                DateTime t = new DateTime(time.Year, time.Month, time.Day, time.Hour, time.Minute, 0);
                if (t.Ticks >= today.Ticks)
                {
                    futureAppointments.Add(appointment);
                }
            }
            return Ok(futureAppointments);
        }

        [HttpGet("past-appointments")]
        public async Task<IActionResult> GetPastAppointments([FromQuery(Name = "cache")] string cacheString)
        {
            User? user = await m_UserManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized();

            List<Appointment> appointments = m_Context.Appointments.Where(a => a.ClientId == user.Id).ToList();
            List<Appointment> pastAppointments = [];
            Guid businessId = Guid.Empty;
            DateTimeOffset today = new DateTimeOffset(DateTime.UtcNow);
            appointments.Sort((Appointment a, Appointment b) =>
            {
                if (a.BusinessId < b.BusinessId)
                    return -1;
                if (a.BusinessId > b.BusinessId)
                    return 1;
                return 0;
            });
            foreach (Appointment appointment in appointments)
            {
                if (businessId != appointment.BusinessId)
                {
                    businessId = appointment.BusinessId;
                    int cityCode = m_Context.Businesses.Where(b => b.Id == appointment.BusinessId).Select(b => b.CityCode).First();
                    string timezone = m_Context.LocationCities.Where(c => c.Id == cityCode).Select(c => c.TimeZone).First();
                    int tzOffset = m_Context.LocationTimeZones.Where(tz => tz.Name == timezone).Select(tz => tz.Offset).First();
                    today = new DateTimeOffset(DateTime.UtcNow).ToOffset(new TimeSpan(tzOffset, 0, 0));
                }

                SADateTime time = new(appointment.Time);
                DateTime t = new DateTime(time.Year, time.Month, time.Day, time.Hour, time.Minute, 0);
                if (t.Ticks < today.Ticks)
                {
                    pastAppointments.Add(appointment);
                }
            }
            return Ok(pastAppointments);
        }

        //TODO add cache
        [HttpGet("info")]
        public async Task<IActionResult> Get([FromQuery] int id, [FromQuery] Guid businessId, [FromQuery(Name = "cache")] string cacheString)
        {
            User? user = await m_UserManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized();

            BusinessService? service = m_Context.BusinessesServices.Where(bs => bs.Id == id && bs.BusinessId == businessId).FirstOrDefault();
            if (service == null)
                return NotFound();

            return Ok(service);
        }

        [HttpGet("available-times")]
        public async Task<IActionResult> GetAvailableTimes([FromQuery] int id, [FromQuery] Guid businessId, [FromQuery(Name = "date")] string dateString)
        {
            User? user = await m_UserManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized();

            Business? business = m_Context.Businesses.Where(b => b.Id == businessId).FirstOrDefault();
            if (business == null)
                return BadRequest();
            LocationCity? city = m_Context.LocationCities.Where(c => c.Id == business.CityCode).FirstOrDefault();
            if (city == null)
                return BadRequest();
            LocationTimeZone? tz = m_Context.LocationTimeZones.Where(t => t.Name == city.TimeZone).FirstOrDefault();
            if (tz == null)
                return BadRequest();
            BusinessService? service = m_Context.BusinessesServices.Where(bs => bs.Id == id && bs.BusinessId == businessId).FirstOrDefault();
            if (service == null)
                return NotFound();

            string[] dateInfo = dateString.Split('/');
            if (dateInfo.Length != 3)
                return BadRequest();

            string day = dateInfo[0];
            string month = dateInfo[1];
            string year  = dateInfo[2];
            DateOnly date = new DateOnly(int.Parse(year), int.Parse(month), int.Parse(day));
            DayOfWeek weekDay = date.DayOfWeek;

            List<ushort> availableTimes = [];

            List<BusinessHours> hours = m_Context.BusinessesHours.Where(
                bh => bh.BusinessId == businessId && bh.Day == weekDay
            ).ToList();
            hours.Sort((a, b) => a.IntervalStart - b.IntervalStart);
            List<Appointment> businessAppointments = m_Context.Appointments.Where(
                a => a.BusinessId == businessId
            ).ToList();
            List<Appointment> appointments = [];
            foreach (Appointment appointment in businessAppointments)
            {
                SADateTime dateTime = new(appointment.Time);
                if (dateTime.Day == date.Day && dateTime.Month == date.Month && dateTime.Year == date.Year)
                    appointments.Add(appointment);
            }

            DateTimeOffset today = new DateTimeOffset(DateTime.UtcNow).ToOffset(new TimeSpan(tz.Offset, 0, 0));
            ushort nowHour = HelperFunctions.MakeHour(today.Hour, today.Minute);
            foreach (BusinessHours hour in hours)
            {
                ushort start = hour.IntervalStart;
                if (date.Year == today.Year && date.Month == today.Month
                    && date.Day == today.Day)
                {
                    while (nowHour > start)
                    {
                        start = HelperFunctions.HourAddMinutes(start, 30);
                    }
                    if (start >= hour.IntervalEnd)
                        continue;
                }
                while (start != hour.IntervalEnd)
                {
                    ushort end = HelperFunctions.HourAddMinutes(start, service.Duration);
                    bool isBusy = false;

                    foreach (Appointment a in appointments)
                    {
                        SADateTime aDate = new SADateTime(a.Time);
                        ushort aStart = HelperFunctions.MakeHour(aDate.Hour, aDate.Minute);
                        if (aStart >= start && aStart < end)
                        {
                            isBusy = true;
                            break;
                        }
                    }
                    if (!isBusy)
                    {
                        availableTimes.Add(start);
                    }
                    start = end;
                }
            }
            return Ok(availableTimes);
        }

        [HttpPost]
        public async Task<IActionResult> Schedule([FromBody] ScheduleData data)
        {
            User? user = await m_UserManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized();

            Business? business = m_Context.Businesses.Where(b => b.Id == data.BusinessId).FirstOrDefault();
            if (business == null)
                return NotFound();

            BusinessService? service = m_Context.BusinessesServices.Where(
                bs => bs.Id == data.ServiceId && bs.BusinessId == business.Id
            ).FirstOrDefault();
            BusinessEmployee? employee = m_Context.BusinessEmployees.Where(be => be.EmployeeId == data.EmployeeId).FirstOrDefault();

            if (service == null || employee == null)
                return NotFound();

            Appointment appointment = new() 
            {
                Id = new Random().Next(),
                BusinessId = business.Id,
                ClientId = user.Id,
                EmployeeId = employee.EmployeeId,
                ServiceId = service.Id,
                Time = data.Time,
            };
            var state = m_Context.Appointments.Add(appointment).State;
            if (state != EntityState.Added)
                return BadRequest();

            UAppointmentConfirmedNotificationInfo nInfo = new()
            {
                User = user,
                BusinessName = business.Name,
                AppointmentTime = appointment.Time
            };
            if (!m_NotificationService.CreateUserAppointmentConfirmedNotification(nInfo))
                return BadRequest();

            BNewAppointmentNotificationInfo bInfo = new()
            {
                User = user,
                Business = business,
                Service = service,
                AppointmentTime = appointment.Time,
            };
            if (!m_NotificationService.CreateBusinessNewAppointmentNotification(bInfo))
                return BadRequest();
            m_Context.SaveChanges();
            return Ok(appointment);
        }
    }
}
