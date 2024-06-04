using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ScheduleAppBackend.Models
{
    [Table("Appointments")]
    [PrimaryKey("Id", "ClientId")]
    public class Appointment
    {
        public int Id { get; set; }
        [Column(TypeName = "uuid")]
        public Guid ClientId { get; set; }
        [Column(TypeName = "uuid")] 
        public Guid BusinessId { get; set; }
        public Guid EmployeeId { get; set; }
        public int ServiceId { get; set; }
        public DateTime Time {  get; set; }


        [JsonIgnore]
        [ForeignKey("BusinessId")]
        public Business Business { get; set; }
        [JsonIgnore]
        [ForeignKey("ClientId")]
        public User Client { get; set; }
        [JsonIgnore]
        [ForeignKey("EmployeeId")]
        public User Employee { get; set; }
        [JsonIgnore]
        [ForeignKey("ServiceId, BusinessId")]
        public BusinessService Service { get; set; }

    }
}
