using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScheduleAppBackend.Context;
using ScheduleAppBackend.Models;

namespace ScheduleAppBackend.Controllers
{
    [Route("api/notifications")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private readonly ScheduleAppContext m_Context;
        private readonly UserManager<User> m_UserManager;

        //TODO Add frontend caching
        public NotificationsController(ScheduleAppContext context, UserManager<User> userManager)
        {
            m_Context = context;
            m_UserManager = userManager;
        }

        [HttpGet("user")]
        public async Task<IActionResult> GetUserNotifications()
        {
            User? user = await m_UserManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized();

            List<UserNotification> notifications = m_Context.UserNotifications.Where(un => un.OwnerId == user.Id).ToList();
            return Ok(notifications);
        }

        [HttpPatch("user")]
        public async Task<IActionResult> MarkUserNotificationsAsRead()
        {
            User? user = await m_UserManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized();

            List<UserNotification> notifications = m_Context.UserNotifications.Where(un => un.OwnerId == user.Id && un.WasVisualized == false).ToList();
            foreach (UserNotification n in notifications)
            {
                n.WasVisualized = true;
            }
            m_Context.UserNotifications.UpdateRange(notifications);
            user.HasUnseenNotifications = false;
            user.LastEditDate = DateTime.UtcNow;
            m_Context.Users.Update(user);
            m_Context.SaveChanges();
            return Ok();
        }

        [HttpDelete("user")]
        public async Task<IActionResult> DeleteUserNotification([FromBody] int id)
        {
            User? user = await m_UserManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized();

            UserNotification? notification = m_Context.UserNotifications.Where(bn => bn.Id == id && bn.OwnerId == user.Id).FirstOrDefault();
            if (notification == null)
                return NotFound();
            var state = m_Context.UserNotifications.Remove(notification).State;
            if (state != EntityState.Deleted)
                return BadRequest();

            m_Context.SaveChanges();
            return Ok();
        }


        [HttpGet("business")]
        public async Task<IActionResult> GetBusinessNotifications()
        {
            User? user = await m_UserManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized();

            Business? business = m_Context.Businesses.Where(b => b.OwnerId == user.Id).FirstOrDefault();
            if (business == null)
                return BadRequest();
            
            List<BusinessNotification> notifications = m_Context.BusinessNotifications.Where(bn => bn.OwnerId == business.Id).ToList();
            return Ok(notifications);
        }

        [HttpPatch("business")]
        public async Task<IActionResult> MarkBusinessNotificationsAsRead()
        {
            User? user = await m_UserManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized();

            Business? business = m_Context.Businesses.Where(b => b.OwnerId == user.Id).FirstOrDefault();
            if (business == null)
                return BadRequest();

            List<BusinessNotification> notifications = m_Context.BusinessNotifications.Where(un => un.OwnerId == business.Id && un.WasVisualized == false).ToList();
            foreach (BusinessNotification n in notifications)
            {
                n.WasVisualized = true;
            }
            m_Context.BusinessNotifications.UpdateRange(notifications);
            business.HasUnseenNotifications = false;
            business.LastEditDate = DateTime.UtcNow;
            m_Context.Businesses.Update(business);
            m_Context.SaveChanges();
            return Ok();
        }

        [HttpDelete("business")]
        public async Task<IActionResult> DeleteBusinessNotification([FromBody] int id)
        {
            User? user = await m_UserManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized();

            Business? business = m_Context.Businesses.Where(b => b.OwnerId == user.Id).FirstOrDefault();
            if (business == null)
                return BadRequest();

            BusinessNotification? notification = m_Context.BusinessNotifications.Where(bn => bn.Id == id && bn.OwnerId == business.Id).FirstOrDefault();
            if (notification == null)
                return NotFound();
            var state = m_Context.BusinessNotifications.Remove(notification).State;
            if (state != EntityState.Deleted)
                return BadRequest();

            m_Context.SaveChanges();
            return Ok();
        }
    }
}
