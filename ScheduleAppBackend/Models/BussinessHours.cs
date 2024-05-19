using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ScheduleAppBackend.Models
{
    [Table("BusinessesHours")]
    [PrimaryKey("Id")]
    public class BusinessHours
    {
        public int Id { get; set; }
        public int BusinessId { get; set; }
        public DayOfWeek Day {  get; set; }
        public ushort IntervalStart { get; set; }
        public ushort IntervalEnd { get; set; }

        [ForeignKey("BusinessId")]
        public Business Business { get; set; }
    }
}
