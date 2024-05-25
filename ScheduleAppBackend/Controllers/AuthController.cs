using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ScheduleAppBackend.Context;
using ScheduleAppBackend.Models;
using ScheduleAppBackend.Types;
using System.Security.Claims;

namespace ScheduleAppBackend.Controllers
{
    public class UserInfo
    {
        public UserInfo(string firstName, string lastName, string email) 
        {
            FirstName = firstName;
            LastName = lastName;
            Email = email;
        }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email{ get; set; }
    }

    [ApiController]
    [Route("/api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly ScheduleAppContext m_Context;
        private readonly UserManager<User> m_UserManager;
        private readonly SignInManager<User> m_SignInManager;

        public AuthController(ScheduleAppContext context, UserManager<User> userManager, SignInManager<User> signInManager)
        {
            m_Context = context;
            m_UserManager = userManager;
            m_SignInManager = signInManager;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginInfo info)
        {
            User? user = m_Context.Users.Where(user => user.Email == info.Email).FirstOrDefault();
            if (user == null)
                return Unauthorized();

            Business? business = m_Context.Businesses.Where(b => b.OwnerId == user.Id).FirstOrDefault();
            var result = await m_SignInManager.PasswordSignInAsync(user, info.Password, false, false);
            if (result.Succeeded)
                return Ok(new LoginResult() { User = user, Business = business});
            return Unauthorized();
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await m_SignInManager.SignOutAsync();
            return Ok();
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterInfo info)
        {
            info.FirstName = char.ToUpper(info.FirstName[0]) + info.FirstName.Substring(1).ToLower();
            info.LastName= char.ToUpper(info.LastName[0]) + info.LastName.Substring(1).ToLower();
            string baseUrl = info.FirstName.ToLower() + "-" + info.LastName.ToLower();
            string profileUlr = baseUrl;
            while (m_Context.Users.Where(u => u.ProfileUrl == profileUlr).Count() != 0)
            {
                profileUlr = baseUrl + "-" + new Random().Next();
            }
            User user = new User()
            {
                FirstName = info.FirstName,
                LastName = info.LastName,
                Email = info.Email,
                ProfileUrl = profileUlr,
                LastEditDate = DateTime.UtcNow
            };


            IdentityResult result = await m_UserManager.CreateAsync(user, info.Password);
            if (!result.Succeeded)
                return BadRequest();
            
            var signInResult = await m_SignInManager.PasswordSignInAsync(user, info.Password, false, false);
            if (signInResult.Succeeded)
                return Ok(true);
            return Ok(false);
        }

        [HttpGet("is-logged")]
        public IActionResult IsLogged()
        {
            bool isLogged = m_SignInManager.IsSignedIn(User);
             if (isLogged)
                return Ok(true);
            return Ok(false);
        }

        [HttpGet("is-email-available")]
        public IActionResult IsEmailAvailable([FromQuery]string email) 
        {
            return Ok(m_Context.Users.Where(user => user.Email.Equals(email)).Count() == 0);
        }

        [HttpGet]
        async public Task<IActionResult> Get()
        {
            User? user = await m_UserManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized();
            return Ok(user);
        }

        [HttpGet("user")]
        public IActionResult GetUser([FromQuery] string url)
        {
            User? user = m_Context.Users.Where(u => u.ProfileUrl == url).FirstOrDefault();
            return Ok(user);
        }
    }
}
