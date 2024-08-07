﻿using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using ScheduleAppBackend.Context;
using ScheduleAppBackend.Models;
using ScheduleAppBackend.Types;
using ScheduleAppBackend.Helpers;

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
        async public Task<IActionResult> Get([FromQuery] int id, [FromQuery(Name = "businessId")] Guid bId, [FromQuery(Name = "cache")] string cacheString)
        {
            User? user = await m_UserManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized();

            BusinessService? service = m_Context.BusinessesServices.Where(
                bs => bs.Id == id && bs.BusinessId == bId
            ).FirstOrDefault();
            if (service == null)
                return NotFound();

            Cache<int> cache = HelperFunctions.ParseIntCacheStringObject(cacheString);
            DateTime value;
            if (cache.CachedDates.TryGetValue(id, out value) && value >= service.LastEditDate)
            {
                return Ok();
            }
            return Ok(service);
        }

        [HttpGet("all")]
        async public Task<IActionResult> GetAll([FromQuery (Name = "businessId")] string? bId, [FromQuery(Name = "cache")] string cacheString)
        {
            Business? business = null;
            if (bId == null)
            {
                User? user = await m_UserManager.GetUserAsync(User);
                if (user == null)
                    return Unauthorized();
                business = m_Context.Businesses.Where(b => b.OwnerId == user.Id).FirstOrDefault();
            }
            else
            {
                Guid businessId = Guid.Parse(bId);
                business = m_Context.Businesses.Where(b => b.Id == businessId).FirstOrDefault();
            }
            if (business == null)
                return BadRequest();

            Cache<int> cache = HelperFunctions.ParseIntCacheStringArray(cacheString);
            List<CachedDataInfo<int>> cachedData = m_Context.BusinessesServices.Select(bs => new CachedDataInfo<int>() { 
                Id = bs.Id,
                LastEditDate = bs.LastEditDate,
            }).Where(cdi => cache.CachedIds.Contains(cdi.Id)).ToList();
            cache.CachedIds.Clear();
            foreach(CachedDataInfo<int> cachedDataInfo in cachedData)
            {
                if (cache.CachedDates[cachedDataInfo.Id] >= cachedDataInfo.LastEditDate)
                    cache.CachedIds.Add(cachedDataInfo.Id);
            }

            return Ok(m_Context.BusinessesServices.Where(
                bs => bs.BusinessId == business.Id
                && !cache.CachedIds.Contains(bs.Id)
            ).ToList());
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

            DateTime date = DateTime.UtcNow;
            BusinessService service = new()
            {
                Id = new Random().Next(),
                Name = info.Name,
                BusinessId = business.Id,
                CategoryId = info.CategoryId,
                Description = info.Description,
                Icon = info.Icon,
                Price = info.Price,
                Duration = info.Duration,
                LastEditDate = date
            };
            var result = m_Context.BusinessesServices.Add(service);
            if (result.State == EntityState.Added)
            {
                m_Context.SaveChanges();
                return Ok(new CreationResult() { Id = service.Id, Date = date });
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
            service.Icon = info.Icon;
            service.Price = info.Price;
            service.Duration = info.Duration;
            service.LastEditDate = DateTime.UtcNow;

            var result = m_Context.BusinessesServices.Update(service);
            if (result.State == EntityState.Modified)
            {
                m_Context.SaveChanges();
                return Ok(service.LastEditDate);
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
        async public Task<IActionResult> GetCategories([FromQuery(Name = "businessId")] string? bId, [FromQuery(Name = "cache")] string cacheString)
        {
            Business? business = null;

            if (bId == null)
            {
                User? user = await m_UserManager.GetUserAsync(User);
                if (user == null)
                    return Unauthorized();
                business = m_Context.Businesses.Where(b => b.OwnerId == user.Id).FirstOrDefault();
            }
            else
            {
                Guid businessId = Guid.Parse(bId);
                business = m_Context.Businesses.Where(b => b.Id == businessId).FirstOrDefault();
            }
            if (business == null)
                return BadRequest();

            Cache<int> cache = HelperFunctions.ParseIntCacheStringArray(cacheString);
            List<CachedDataInfo<int>> cachedData = m_Context.BusinessesServicesCategories.Select(bsc => new CachedDataInfo<int>()
            {
                Id = bsc.Id,
                LastEditDate = bsc.LastEditDate,
            }).Where(cdi => cache.CachedIds.Contains(cdi.Id)).ToList();
            cache.CachedIds.Clear();
                
            foreach (CachedDataInfo<int> cachedDataInfo in cachedData)
            {
                if (cache.CachedDates[cachedDataInfo.Id] >= cachedDataInfo.LastEditDate)
                    cache.CachedIds.Add(cachedDataInfo.Id);
            }
            List<BusinessServiceCategory> list = m_Context.BusinessesServicesCategories.Where(
                bsc => bsc.BusinessId == business.Id
                && !cache.CachedIds.Contains(bsc.Id)
            ).ToList();
            return Ok(list);
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

            DateTime date = DateTime.UtcNow;
            BusinessServiceCategory category = new()
            {
                Id = new Random().Next(),
                BusinessId = business.Id,
                Name = info.Name,   
                LastEditDate = date
            };
            var result = m_Context.BusinessesServicesCategories.Add(category);
            if (result.State == EntityState.Added)
            {
                m_Context.SaveChanges();
                return Ok(new CreationResult() { Id = category.Id, Date = date });
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
            category.LastEditDate = DateTime.UtcNow;
            var result = m_Context.Update(category);
            if (result.State == EntityState.Modified)
            {
                m_Context.SaveChanges();
                return Ok(category.LastEditDate);
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
                m_Context.BusinessesServicesCategories.Where(
                    bsc => bsc.Id == info.Id && bsc.BusinessId == business.Id)
                .FirstOrDefault();
            if (category == null)
                return BadRequest();

            List<BusinessService> services = 
                m_Context.BusinessesServices.Where(
                    bs => bs.BusinessId == business.Id && bs.CategoryId == category.Id)
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
