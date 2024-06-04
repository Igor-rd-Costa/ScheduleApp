using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ScheduleAppBackend.Models
{
    [Table("BusinessesHours")]
    [PrimaryKey("Id", "BusinessId")]
    public class BusinessHours
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }
        [JsonIgnore]
        [Column(TypeName = "uuid")]
        public Guid BusinessId { get; set; }
        public DayOfWeek Day {  get; set; }
        public ushort IntervalStart { get; set; }
        public ushort IntervalEnd { get; set; }
        public DateTime LastEditDate { get; set; }

        [JsonIgnore]
        [ForeignKey("BusinessId")] 
        public Business Business { get; set; }
    }
}
