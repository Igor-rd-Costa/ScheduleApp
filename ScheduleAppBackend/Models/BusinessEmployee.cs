using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ScheduleAppBackend.Models
{
    [Table("BusinessEmployees")]
    [PrimaryKey("Id", "EmployeeId")]
    public class BusinessEmployee
    {
        public int Id { get; set; }
        [Column(TypeName = "uuid")]
        public Guid EmployeeId { get; set; }
        [Column(TypeName = "uuid")]
        public Guid BusinessId { get; set; }

        [JsonIgnore]
        [ForeignKey("EmployeeId")]
        public User Employee { get; set; } = default!;
        [JsonIgnore]
        [ForeignKey("BusinessId")]
        public Business Business { get; set; } = default!;
    }
}
