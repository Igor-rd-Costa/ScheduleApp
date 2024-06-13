using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ScheduleAppBackend.Context;
using ScheduleAppBackend.Models;

namespace ScheduleAppBackend.Controllers
{
    [Route("api/location")]
    [ApiController]
    public class LocationController : ControllerBase
    {
        private readonly ScheduleAppContext m_Context;
        private readonly UserManager<User> m_UserManager;

        public LocationController(ScheduleAppContext context, UserManager<User> userManager)
        {
            m_Context = context;
            m_UserManager = userManager;
        }

        [HttpGet("countries")]
        async public Task<IActionResult> GetCountries()
        {
            User? user = await m_UserManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized();

            return Ok(m_Context.LocationCountries.Where(c => true).ToList());
        }

        [HttpGet("states")]
        async public Task<IActionResult> GetStates([FromQuery] string country, [FromQuery] int cache)
        {
            User? user = await m_UserManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized();

            if (country == "")
                return BadRequest();

            if (m_Context.LocationStates.Where(s => s.CountryCode == country).Count() == cache)
                return Ok();

            return Ok(m_Context.LocationStates.Where(s => s.CountryCode == country).ToList());
        }

        [HttpGet("state")]
        async public Task<IActionResult> GetState([FromQuery] string countryCode, [FromQuery] string stateCode)
        {
            User? user = await m_UserManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized();

            if (countryCode == "" || stateCode == "")
                return BadRequest();

            LocationState? state = m_Context.LocationStates.Where(s => s.CountryCode == countryCode && s.Code == stateCode).FirstOrDefault();
            return Ok(state);
        }

        [HttpGet("cities")]
        async public Task<IActionResult> GetCities([FromQuery] string country, [FromQuery] string state, [FromQuery] int cache)
        {
            User? user = await m_UserManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized();

            if (state == "")
                return BadRequest();

            if (m_Context.LocationCities.Where(c => c.State == state && c.Country == country).Count() == cache)
                return Ok();

            return Ok(m_Context.LocationCities.Where(c => c.State == state && c.Country == country).ToList());
        }

        [HttpGet("city")]
        async public Task<IActionResult> GetCity([FromQuery] int id)
        {
            User? user = await m_UserManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized();

            return Ok(m_Context.LocationCities.Where(c => c.Id == id).FirstOrDefault());    
        }
    }
}
