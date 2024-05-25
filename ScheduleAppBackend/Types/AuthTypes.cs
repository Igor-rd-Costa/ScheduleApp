using ScheduleAppBackend.Models;

namespace ScheduleAppBackend.Types
{

    public class LoginResult
    {
        public User User { get; set; }
        public Business? Business { get; set; }
    }
    public class LoginInfo
    {
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
    }
    public class RegisterInfo
    {
        public string FirstName { get; set; } = "";
        public string LastName { get; set; } = "";
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
    }

    public class IsEmailAvailableInfo
    {
        public string Email { get; set; } = "";
    }
}
