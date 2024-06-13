using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ScheduleAppBackend.Models
{
    [Table("LocationCities")]
    [PrimaryKey("Id")]
    public class LocationCity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string TimeZone { get; set; }
        [MaxLength(2)]
        public string Country { get; set; }
        public string State { get; set; }
    }
}
