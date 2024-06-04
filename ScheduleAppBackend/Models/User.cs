using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ScheduleAppBackend.Models
{
    [Table("Users")]
    
    [PrimaryKey("Id")]
    public class User
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column(TypeName = "uuid")]
        public Guid Id { get; set; }
        public string FirstName { get; set; } = "";
        public string LastName { get; set; } = "";
        [MaxLength(320)]
        public string Email { get; set; } = "";
        public bool IsEmailConfirmed { get; set; }
        public string ProfileUrl { get; set; }
        [JsonIgnore]
        public string Password { get; set; } = "";
        public DateTime LastEditDate { get; set; }
    }
}
