using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScheduleAppBackend.Context;
using ScheduleAppBackend.Helpers;
using ScheduleAppBackend.Models;
using ScheduleAppBackend.Types;
using System.Globalization;
using System.Text;
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
        async public Task<IActionResult> Get([FromQuery] Guid? id, [FromQuery] string? businessUrl, [FromQuery(Name = "cache")] string cacheString)
        {
 
            User? user = await m_UserManager.GetUserAsync(User);

            Cache<Guid> cache = HelperFunctions.ParseGuidCacheStringObject(cacheString);

            Business? business = null;
            if (businessUrl == null && id == null)
            {
                if (user == null)
                    return Unauthorized();

                business = m_Context.Businesses.Where(b => b.OwnerId == user.Id).FirstOrDefault();
            }
            else
            {
                if (id != null)
                    business = m_Context.Businesses.Where(b => b.Id == id).FirstOrDefault();
                else if (businessUrl != null)
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

        [HttpGet("employee")]
        public IActionResult GetEmployee([FromQuery] Guid businessId, [FromQuery] Guid id, [FromQuery(Name = "cache")] string cacheString)
        {
            BusinessEmployee? employee = m_Context.BusinessEmployees.Where(be => be.EmployeeId == id && be.BusinessId == businessId).FirstOrDefault();
            if (employee == null)
                return NotFound();

            User? user = m_Context.Users.Where(u => u.Id == employee.EmployeeId).FirstOrDefault();
            if (user == null)
                return NotFound();

            return Ok(user);
        }

        [HttpGet("employees")]
        async public Task<IActionResult> GetEmployees([FromQuery] Guid? businessId, [FromQuery(Name = "cache")] string cacheString)
        {
            Business? business = null;
            if (businessId == null)
            {
                User? user = await m_UserManager.GetUserAsync(User);
                if (user == null)
                    return Unauthorized();

                business = m_Context.Businesses.Where(b => b.OwnerId == user.Id).FirstOrDefault();
            }
            else
            {
                business = m_Context.Businesses.Where(b => b.Id == businessId).FirstOrDefault();
            }
            if (business == null) 
                return NotFound();    

            List<Guid> employees = m_Context.BusinessEmployees.Where(
                be => be.BusinessId == business.Id
            ).Select(b => b.EmployeeId).ToList();

            List<User> users = m_Context.Users.Where(u => employees.Contains(u.Id)).ToList();

            return Ok(users);
        }

        [HttpPost]
        async public Task<IActionResult> Create([FromBody] CreateBusinessInfo info)
        {
            User? user = await m_UserManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized();

            if (m_Context.Businesses.Where(b => b.OwnerId == user.Id).Count() != 0)
                return BadRequest();

            Business newBusiness = new Business()
            {
                Id = Guid.NewGuid(),
                OwnerId = user.Id,
                Name = info.Name,
                Description = info.Description,
                BusinessUrl = MakeCustomUrl(info.Name),
                LastEditDate = DateTime.UtcNow
            };


            EntityState state = m_Context.Businesses.Add(newBusiness).State;
            if (state == EntityState.Added)
            {
                BusinessEmployee be = new()
                {
                    Id = new Random().Next(),
                    BusinessId = newBusiness.Id,
                    EmployeeId = user.Id
                };
                state = m_Context.BusinessEmployees.Add(be).State;
                if (state != EntityState.Added)
                    return BadRequest();
                m_Context.SaveChanges();
                return Ok(newBusiness);
            }
            return BadRequest();
        }

        [HttpGet("search")]
        async public Task<IActionResult> Search([FromQuery] SearchBusinessInfo info)
        {
            Cache<Guid> cache = HelperFunctions.ParseGuidCacheStringArray(info.Cached);
            List<CachedDataInfo<Guid>> cachedBusinesses = m_Context.Businesses.Select(b => new CachedDataInfo<Guid>()
            {
                Id = b.Id,
                LastEditDate = b.LastEditDate,
            }).Where(b => cache.CachedIds.Contains(b.Id)).ToList();
            cache.CachedIds.Clear();
            foreach (CachedDataInfo<Guid> item in cachedBusinesses)
            {
                if (cache.CachedDates[item.Id] >= item.LastEditDate)
                    cache.CachedIds.Add(item.Id);
            }
            var businesses = m_Context.Businesses.Where(b =>
                b.Name.ToLower().Contains(info.Query.ToLower()) 
                && !cache.CachedIds.Contains(b.Id)
            ).ToList();
            return Ok(businesses);
        }

        private string MakeCustomUrl(string businessName)
        {
            string baseUrl = HelperFunctions.RemoveDiacritics(businessName.Replace(' ', '-').ToLower());
            string customUrl = baseUrl;
            while (m_Context.Businesses.Where(b => b.BusinessUrl == customUrl.ToLower()).Count() != 0)
            {
                customUrl = baseUrl + "-" + new Random().Next();
            }

            return customUrl;
        }
    }
}
