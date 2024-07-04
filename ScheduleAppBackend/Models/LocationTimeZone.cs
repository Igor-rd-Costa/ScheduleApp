using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ScheduleAppBackend.Models
{
    [Table("LocationTimeZones")]
    [PrimaryKey("Id")]
    public class LocationTimeZone
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public int Offset { get; set; }
    }
}
