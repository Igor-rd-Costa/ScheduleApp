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
        public string Name { get; set; } = "";
        public int? TimeZoneId { get; set; }
        public int CountryId { get; set; }
        public int StateId { get; set; }

        [JsonIgnore]
        [ForeignKey("TimeZoneId")]
        public LocationTimeZone TimeZone { get; set; } = default!;
        [JsonIgnore]
        [ForeignKey("CountryId")]
        public LocationCountry Country { get; set; } = default!;
        [JsonIgnore]
        [ForeignKey("StateId")]
        public LocationState State { get; set; } = default!;
    }
}
