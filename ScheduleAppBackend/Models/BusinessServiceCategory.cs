using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ScheduleAppBackend.Models
{
    [Table("BusinessesServicesCategories")]
    [PrimaryKey("Id", "BusinessId")]
    public class BusinessServiceCategory
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }
        [Column(TypeName = "uuid")]
        public Guid BusinessId { get; set; }
        public string Name { get; set; } = "";
        public DateTime LastEditDate { get; set; }

        [JsonIgnore]
        [ForeignKey("BusinessId")]
        public Business Business { get; set; } = default!;
    }
}
