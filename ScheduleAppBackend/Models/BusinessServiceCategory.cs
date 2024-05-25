using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ScheduleAppBackend.Models
{
    [Table("BusinessesServicesCategories")]
    [PrimaryKey("Id")]
    public class BusinessServiceCategory
    {
        public int Id { get; set; }
        public int BusinessId { get; set; }
        public string Name { get; set; }
        public DateTime LastEditDate { get; set; }

        [ForeignKey("BusinessId")]
        [JsonIgnore]
        public Business Business { get; set; }
    }
}
