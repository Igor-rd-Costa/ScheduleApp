using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace ScheduleAppBackend.Models
{
    [Table("LocationCountries")]
    [PrimaryKey("ISOCode")]
    public class LocationCountry
    {
        public string ISOCode { get; set; } = "";
        public string Name { get; set; } = "";
    }
}
