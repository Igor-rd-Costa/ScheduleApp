using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ScheduleAppBackend.Models
{
    [Table("BusinessEmployeesHours")]
    [PrimaryKey("Id", "EmployeeId")]
    public class BusinessEmployeeHours
    {
        public int Id { get; set; }
        [Column(TypeName = "uuid")]
        public Guid EmployeeId { get; set; }
        [Column(TypeName = "uuid")]
        public Guid BusinessId { get; set; }
        public ushort StartTime { get; set; }
        public ushort EndTime { get; set; }

        [JsonIgnore]
        [ForeignKey("EmployeeId")]
        public User Employee { get; set; }
        [JsonIgnore]
        [ForeignKey("BusinessId")]
        public Business Business { get; set; }

    }
}
