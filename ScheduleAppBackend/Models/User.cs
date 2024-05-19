using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ScheduleAppBackend.Models
{
    [Table("Users")]
    [PrimaryKey("Id")]
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = "";
        public string LastName { get; set; } = "";
        [MaxLength(320)]
        public string Email { get; set; } = "";
        public bool IsEmailConfirmed { get; set; }
        public string Password { get; set; } = "";
    }
}
