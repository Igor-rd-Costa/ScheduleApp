using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using ScheduleAppBackend.Context;
using ScheduleAppBackend.Models;
using ScheduleAppBackend.Types;

namespace ScheduleAppBackend.Controllers
{
    [Route("api/business-service")]
    [ApiController]
    public class BusinessServicesController : ControllerBase
    {
        private readonly ScheduleAppContext m_Context;
        private readonly UserManager<User> m_UserManager;

        public BusinessServicesController(ScheduleAppContext context, UserManager<User> userManager)
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
                return BadRequest();
            return Ok(m_Context.BusinessesServices.Where(bs => bs.BusinessId == business.Id).ToList());
        }

        [HttpPost]
        async public Task<IActionResult> Create([FromBody] CreateServiceInfo info)
        {
            User? user = await m_UserManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized();
            Business? business = m_Context.Businesses.Where(b => b.OwnerId == user.Id).FirstOrDefault();
            if (business == null)
                return BadRequest();

            if (info.CategoryId.HasValue)
            {
                if (m_Context.BusinessesServicesCategories.Where(
                    bsc => bsc.Id == info.CategoryId && bsc.BusinessId == business.Id).Count() == 0)
                    return BadRequest();
            }

            BusinessService service = new()
            {
                Name = info.Name,
                BusinessId = business.Id,
                CategoryId = info.CategoryId,
                Description = info.Description,
                Price = info.Price,
                Duration = info.Duration,
            };
            var result = m_Context.BusinessesServices.Add(service);
            if (result.State == EntityState.Added)
            {
                m_Context.SaveChanges();
                return Ok(service.Id);
            }
            return BadRequest();
        }

        [HttpPatch]
        async public Task<IActionResult> Update([FromBody] UpdateServiceInfo info)
        {
            User? user = await m_UserManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized();

            Business? business = m_Context.Businesses.Where(b => b.OwnerId == user.Id).FirstOrDefault();
            if (business == null)
                return BadRequest();

            BusinessService? service = m_Context.BusinessesServices.Where(bs => bs.Id == info.Id).FirstOrDefault();
            if (service == null || service.BusinessId != business.Id)
                return BadRequest();

            service.CategoryId = info.CategoryId;
            service.Name = info.Name;
            service.Description = info.Description;
            service.Price = info.Price;
            service.Duration = info.Duration;

            var result = m_Context.BusinessesServices.Update(service);
            if (result.State == EntityState.Modified)
            {
                m_Context.SaveChanges();
                return Ok();
            }
            return BadRequest();
        }

        [HttpDelete]
        async public Task<IActionResult> Delete([FromBody] DeleteServiceInfo info)
        {
            User? user = await m_UserManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized();

            Business? business = m_Context.Businesses.Where(b => b.OwnerId == user.Id).FirstOrDefault();
            if (business == null)
                return BadRequest();

            BusinessService? service = m_Context.BusinessesServices.Where(bs => bs.Id == info.Id && bs.BusinessId == business.Id).FirstOrDefault();
            if (service == null)
                return BadRequest();

            var result = m_Context.BusinessesServices.Remove(service);
            if (result.State == EntityState.Deleted)
            {
                m_Context.SaveChanges();
                return Ok();
            }
            return BadRequest();
        }


        [HttpGet("category")]
        async public Task<IActionResult> GetCategories()
        {
            User? user = await m_UserManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized();
            Business? business = m_Context.Businesses.Where(b => b.OwnerId == user.Id).FirstOrDefault();
            if (business == null)
                return BadRequest();
            return Ok(m_Context.BusinessesServicesCategories.Where(bsc => bsc.BusinessId == business.Id).ToList());
        }

        [HttpPost("category")]
        async public Task<IActionResult> CreateCategory([FromBody] CreateCategoryInfo info)
        {
            User? user = await m_UserManager.GetUserAsync(User);
            if (user == null) 
                return Unauthorized();
            Business? business = m_Context.Businesses.Where(b => b.OwnerId == user.Id).FirstOrDefault();
            if (business == null)
                return BadRequest();

            BusinessServiceCategory category = new()
            {
                BusinessId = business.Id,
                Name = info.Name,
            };
            var result = m_Context.BusinessesServicesCategories.Add(category);
            if (result.State == EntityState.Added)
            {
                m_Context.SaveChanges();
                return Ok(category.Id);
            }
            return BadRequest();
        }

        [HttpPatch("category")]
        async public Task<IActionResult> UpdateCategory([FromBody] UpdateCategoryInfo info)
        {
            User? user = await m_UserManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized();
            Business? business = m_Context.Businesses.Where(b => b.OwnerId == user.Id).FirstOrDefault();
            if (business == null)
                return BadRequest();

            BusinessServiceCategory? category = m_Context.BusinessesServicesCategories.Where(bsc => bsc.Id == info.Id).FirstOrDefault();
            if (category == null || category.BusinessId != business.Id)
                return BadRequest();

            category.Name = info.Name;
            var result = m_Context.Update(category);
            if (result.State == EntityState.Modified)
            {
                m_Context.SaveChanges();
                return Ok();
            }
            return BadRequest();
        }

        [HttpDelete("category")]
        async public Task<IActionResult> DeleteCategory([FromBody] DeleteCategoryInfo info)
        {
            User? user = await m_UserManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized();
            Business? business = m_Context.Businesses.Where(b => b.OwnerId == user.Id).FirstOrDefault();
            if (business == null)
                return BadRequest();
            
            BusinessServiceCategory? category = 
                m_Context.BusinessesServicesCategories.Where(bsc => bsc.Id == info.Id && bsc.BusinessId == business.Id)
                .FirstOrDefault();
            if (category == null)
                return BadRequest();

            List<BusinessService> services = 
                m_Context.BusinessesServices.Where(bs => bs.BusinessId == business.Id && bs.CategoryId == category.Id)
                .ToList();

            if (info.DeleteServices)
            {
                m_Context.BusinessesServices.RemoveRange(services);
            } else
            {
                foreach (BusinessService service in services)
                {
                    service.CategoryId = null;
                }
                m_Context.BusinessesServices.UpdateRange(services);
            }
            var result = m_Context.BusinessesServicesCategories.Remove(category);
            if (result.State == EntityState.Deleted)
            {
                m_Context.SaveChanges();
                return Ok();
            }
            return BadRequest();
        }

    }
}
