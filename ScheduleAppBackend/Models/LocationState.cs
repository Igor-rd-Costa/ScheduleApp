using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ScheduleAppBackend.Models
{
    [Table("LocationStates")]
    [PrimaryKey("Code", "CountryCode")]
    public class LocationState
    {
        public string Code { get; set; }
        [MaxLength(2)]
        public string CountryCode { get; set; } = "";
        public string Name { get; set; } = "";
    }

}
