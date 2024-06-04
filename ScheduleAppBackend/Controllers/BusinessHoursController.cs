using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ScheduleAppBackend.Context;
using ScheduleAppBackend.Helpers;
using ScheduleAppBackend.Models;


using ScheduleAppBackend.Types;
using System.Linq;


namespace ScheduleAppBackend.Controllers
{
    [Route("api/business-hours")]
    [ApiController]
    public class BusinessHoursController : ControllerBase
    {
        private readonly ScheduleAppContext m_Context;
        private readonly UserManager<User> m_UserManager;

        public BusinessHoursController(ScheduleAppContext context, UserManager<User> userManager) 
        { 
            m_Context = context;
            m_UserManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] string? id, [FromQuery(Name = "cache")] string cacheString)
        {
            Business? business = null;
            if (id == null)
            {
                User? user = await m_UserManager.GetUserAsync(User);
                if (user == null)
                    return Unauthorized();

                business = m_Context.Businesses.Where(b => b.OwnerId == user.Id).FirstOrDefault();
            }
            else
            {
                Guid businessId = Guid.Empty;
                if (!Guid.TryParse(id, out businessId))
                    return BadRequest();

                business = m_Context.Businesses.Where(b => b.Id == businessId).FirstOrDefault();
            }
            if (business == null)
                return BadRequest();

            Cache<int> cache = HelperFunctions.ParseIntCacheStringArray(cacheString);
            List<CachedDataInfo<int>> cachedData = m_Context.BusinessesHours.Select(bh =>
                new CachedDataInfo<int>() { Id = bh.Id, LastEditDate = bh.LastEditDate }
            ).Where(cdi => 
                cache.CachedIds.Contains(cdi.Id)
            ).ToList();
            cache.CachedIds.Clear();
            foreach(CachedDataInfo<int> cachedDataInfo in cachedData)
            {
                if (cache.CachedDates[cachedDataInfo.Id] >= cachedDataInfo.LastEditDate)
                    cache.CachedIds.Add(cachedDataInfo.Id);
            }
            
            return Ok(m_Context.BusinessesHours.Where(bh => 
                bh.BusinessId == business.Id && !cache.CachedIds.Contains(bh.Id)
            ).ToList());
        }

        [HttpPatch]
        public async Task<IActionResult> Update([FromBody] BusinessHoursUpdateInfo businessHoursUpdateInfo)
        {
            User? user = await m_UserManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized();

            Business? business = m_Context.Businesses.Where(b => b.OwnerId == user.Id).FirstOrDefault();
            if (business == null)
                return BadRequest();

            List<int> updateIds = businessHoursUpdateInfo.UpdateInfo.Select(b => b.Id).ToList();
            List<BusinessHours> hours = m_Context.BusinessesHours.Where(
                bhci => bhci.BusinessId == business.Id
            ).ToList();
            List<BusinessHours> toUpdate = hours.Where(bh => updateIds.Contains(bh.Id)).ToList();
            List<BusinessHours> toDelete = hours.Where(bh => businessHoursUpdateInfo.DeleteInfo.Contains(bh.Id)).ToList();

            DateTime lastEditTime = DateTime.UtcNow;
            foreach (BusinessHours businessHours in toUpdate)
            {
                BusinessHourUpdateInfo? info = businessHoursUpdateInfo.UpdateInfo.Where(bhci => bhci.Id == businessHours.Id).FirstOrDefault();
                if (info == null)
                    continue;

                businessHours.IntervalStart = info.IntervalStart;
                businessHours.IntervalEnd = info.IntervalEnd;
                businessHours.Day = info.Day;
                businessHours.LastEditDate = lastEditTime;
                m_Context.BusinessesHours.Update(businessHours);
            }
            foreach (BusinessHours businessHours in toDelete)
            {
                m_Context.BusinessesHours.Remove(businessHours);
            }
            List<BusinessHours> newHours = businessHoursUpdateInfo.CreateInfo.Select(bhci => new BusinessHours()
            {
                Id = new Random().Next(),
                BusinessId = business.Id,
                Day = bhci.Day,
                IntervalStart = bhci.IntervalStart,
                IntervalEnd = bhci.IntervalEnd,
                LastEditDate = lastEditTime
            }).ToList();
            m_Context.BusinessesHours.AddRange(newHours);
            m_Context.SaveChanges();
            return Ok(newHours);
        }
    }
}
