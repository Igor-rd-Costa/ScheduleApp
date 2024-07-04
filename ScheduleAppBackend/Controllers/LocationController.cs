using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ScheduleAppBackend.Context;
using ScheduleAppBackend.Models;
using ScheduleAppBackend.Services.Interfaces;

namespace ScheduleAppBackend.Controllers
{
    [Route("api/location")]
    [ApiController]
    public class LocationController : ControllerBase
    {
        private readonly ScheduleAppContext m_Context;
        private readonly UserManager<User> m_UserManager;
        private readonly ILocationService m_LocationService;

        public LocationController(ScheduleAppContext context, UserManager<User> userManager, ILocationService locationService)
        {
            m_Context = context;
            m_UserManager = userManager;
            m_LocationService = locationService;
        }

        [HttpGet("countries")]
        public async Task<IActionResult> GetCountries([FromQuery] int cacheCount)
        {
            List<LocationCountry> countries = [];
            if (m_Context.LocationCountries.Count() == 0)
            {
                countries = await m_LocationService.GetCountries();
                m_Context.LocationCountries.AddRange(countries);
                m_Context.SaveChanges();
            } 
            else
            {
                countries = m_Context.LocationCountries.Select(lc => lc).ToList();
                if (countries.Count == cacheCount)
                    return Ok();
            }

            return Ok(countries);
        }

        [HttpGet("country")]
        public async Task<IActionResult> GetCountry([FromQuery] int? countryId)
        {
            if (countryId == null)
                return BadRequest("Missing parameter countryId.");

            if (m_Context.LocationCountries.Count() == 0)
            {
                List<LocationCountry> countries = await m_LocationService.GetCountries();
                m_Context.LocationCountries.AddRange(countries);
                m_Context.SaveChanges();
            }
            LocationCountry? country = m_Context.LocationCountries.Where(c => c.Id == countryId.Value).FirstOrDefault();
            if (country == null)
                return NotFound();
            return Ok(country);
        }

        [HttpGet("states")]
        public async Task<IActionResult> GetStates([FromQuery] int? countryId, [FromQuery] int cache)
        {
            if (countryId == null)
                return BadRequest();

            List<LocationState> states = m_Context.LocationStates.Where(ls => ls.CountryId == countryId).ToList();
            if (states.Count == 0)
            {
                states = await m_LocationService.GetStates(countryId.Value);
                m_Context.LocationStates.AddRange(states);
                m_Context.SaveChanges();
            }
            else if (states.Count == cache)
                    return Ok();

            return Ok(states);
        }

        [HttpGet("state")]
        public async Task<IActionResult> GetState([FromQuery] int? stateId)
        {
            if (stateId == null)
                return BadRequest();

            LocationState? state = m_Context.LocationStates.Where(s => s.Id == stateId.Value).FirstOrDefault();
            if (state == null)
            {
                state = await m_LocationService.GetState(stateId.Value);
            }

            return Ok(state);
        }

        [HttpGet("cities")]
        public async Task<IActionResult> GetCities([FromQuery] int? countryId, [FromQuery] int? stateId, [FromQuery] int cache)
        {
            if (countryId == null || stateId == null)
                return BadRequest();

            List<LocationCity> cities = m_Context.LocationCities.Where(c => c.StateId == stateId).ToList();
            if (cities.Count == 0)
            {
                cities = await m_LocationService.GetCities(countryId.Value, stateId.Value);
                m_Context.LocationCities.AddRange(cities);
                m_Context.SaveChanges();
            } else
            {
                if (cities.Count == cache)
                    return Ok();
            }
            return Ok(cities);
        }

        [HttpGet("city")]
        public async Task<IActionResult> GetCity([FromQuery] int cityId)
        {
            LocationCity? city = m_Context.LocationCities.Where(c => c.Id == cityId).FirstOrDefault();
            if (city == null)
            {
                city = await m_LocationService.GetCity(cityId);
                if (city == null)
                    return NotFound();
            }
            return Ok(city);
        }
    }
}
