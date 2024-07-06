using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ScheduleAppBackend.Controllers
{
    [Route("api/")]
    [ApiController]
    public class HealthCheckController : ControllerBase
    {
        // Used for AWS EC2 Target Groups health checks.
        [HttpGet]
        public IActionResult Get()
        {
            return Ok();
        }
    }
}
