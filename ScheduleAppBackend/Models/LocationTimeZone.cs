using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ScheduleAppBackend.Models
{
    [Table("LocationTimeZones")]
    [PrimaryKey("Name")]
    public class LocationTimeZone
    {
        public string Name { get; set; } = "";
        public int Offset { get; set; }
    }
}
