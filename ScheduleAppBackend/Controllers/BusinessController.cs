using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScheduleAppBackend.Context;
using ScheduleAppBackend.Models;
using ScheduleAppBackend.Types;

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
        async public Task<IActionResult> Get()
        {
            User? user = await m_UserManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized();

            Business? business = m_Context.Businesses.Where(b => b.OwnerId == user.Id).FirstOrDefault();
            if (business == null)
                return NotFound();

            return Ok(new BusinessInfo() 
            { 
                Name = business.Name,
                Description = business.Description
            });
        }

        [HttpPost]
        async public Task<IActionResult> Post([FromBody] BusinessInfo info)
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
                Description = info.Description
            }).State;
            if (state == EntityState.Added)
            {
                m_Context.SaveChanges();
                return Ok(info);
            }
            return BadRequest();
        }
    }
}
