using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ScheduleAppBackend.Models
{
    [Table("LocationStates")]
    [PrimaryKey("Id")]
    public class LocationState
    {
        public int Id { get; set; }
        public int CountryId { get; set; }
        public string Name { get; set; } = "";

        [JsonIgnore]
        [ForeignKey("CountryId")]
        public LocationCountry Country { get; set; } = default!;
    }

}
