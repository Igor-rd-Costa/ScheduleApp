using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace ScheduleAppBackend.Models
{
    [Table("LocationCountries")]
    [PrimaryKey("Id")]
    public class LocationCountry
    {
        public int Id { get; set; }
        public string ISOCode { get; set; } = "";
        public string Name { get; set; } = "";
        public string Currency { get; set; } = "";
    }
}
