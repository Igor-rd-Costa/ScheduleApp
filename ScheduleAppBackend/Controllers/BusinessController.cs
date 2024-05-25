using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScheduleAppBackend.Context;
using ScheduleAppBackend.Helpers;
using ScheduleAppBackend.Models;
using ScheduleAppBackend.Types;
using System.Text.Json.Nodes;
using System.Web;


namespace ScheduleAppBackend.Controllers
{
    [Route("/api/business")]
    [ApiController]
    public class BusinessController : ControllerBase
    {
        private readonly ScheduleAppContext m_Context;
        private readonly UserManager<User> m_UserManager;
        public BusinessController(ScheduleAppContext context, UserManager<User> userManager) 
        {
            m_Context = context;
            m_UserManager = userManager;
        }


        [HttpGet]
        async public Task<IActionResult> Get([FromQuery] string? businessUrl, [FromQuery(Name = "cache")] string? cacheString)
        {
 
            User? user = await m_UserManager.GetUserAsync(User);

            Cache? cache = cacheString != null ? HelperFunctions.ParseCacheStringObject(cacheString) : null;

            Business? business = null;
            if (businessUrl == null)
            {
                if (user == null)
                    return Unauthorized();

                business = m_Context.Businesses.Where(b => b.OwnerId == user.Id).FirstOrDefault();
            }
            else
            {
                business = m_Context.Businesses.Where(b => b.BusinessUrl == businessUrl.ToLower().Replace(' ', '-')).FirstOrDefault();
            }
            if (business == null)
                return NotFound();

            if (cache != null && cache.CachedDates.ContainsKey(business.Id))
            {
                if (cache.CachedDates[business.Id] >= business.LastEditDate)
                    return Ok();
            }
            return Ok(business);
        }

        [HttpPost]
        async public Task<IActionResult> Create([FromBody] CreateBusinessInfo info)
        {
            User? user = await m_UserManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized();

            if (m_Context.Businesses.Where(b => b.OwnerId == user.Id).Count() != 0)
                return BadRequest();

            EntityState state = m_Context.Businesses.Add(new Business()
            {
                OwnerId = user.Id,
                Name = info.Name,
                Description = info.Description,
                BusinessUrl = MakeCustomUrl(info.Name),
                LastEditDate = DateTime.UtcNow
            }).State;
            if (state == EntityState.Added)
            {
                m_Context.SaveChanges();
                return Ok(info);
            }
            return BadRequest();
        }

        [HttpGet("search")]
        async public Task<IActionResult> Search([FromQuery] SearchBusinessInfo info)
        {
            info.Cached = HttpUtility.UrlDecode(info.Cached) ?? "";
            Console.WriteLine("Query:\n " + info.Query);
            Console.WriteLine("Cached:\n " + info.Cached);

            var cachedArray = JsonArray.Parse(info.Cached);
            List<int> cachedIds = [];
            Dictionary<int, DateTime> cachedDates = new Dictionary<int, DateTime>();
           
            if (cachedArray != null)
            {
                foreach (var item in cachedArray.AsArray())
                {
                    if (item == null)
                        continue;
                    var obj = item.AsObject();
                    int id = obj["id"]?.GetValue<int>() ?? -1;
                    DateTime date = obj["lastEditDate"]?.GetValue<DateTime>() ?? DateTime.UnixEpoch;
                    cachedIds.Add(id);
                    cachedDates[id] = date;
                }
            }
         
            var cachedBusinesses = m_Context.Businesses.Select(b => new CachedDataInfo()
            {
                Id = b.Id,
                LastEditDate = b.LastEditDate,
            }).Where(b => cachedIds.Contains(b.Id)).ToList();
            cachedIds.Clear();
            foreach (CachedDataInfo item in cachedBusinesses)
            {
                if (item.LastEditDate >= cachedDates[item.Id])
                    cachedIds.Add(item.Id);
            }

            var businesses = m_Context.Businesses.Where(b =>
                b.Name.ToLower().Contains(info.Query.ToLower()) 
                && !cachedIds.Contains(b.Id)
            ).ToList();
            return Ok(businesses);
        }

        private string MakeCustomUrl(string businessName)
        {
            string baseUrl = businessName.Replace(' ', '-').ToLower();
            string customUrl = baseUrl;
            while (m_Context.Businesses.Where(b => b.BusinessUrl == customUrl.ToLower()).Count() != 0)
            {
                baseUrl += "-" + new Random().Next();
            }

            return customUrl;
        }
    }
}
