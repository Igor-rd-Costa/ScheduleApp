using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ScheduleAppBackend.Models
{
    [Table("BusinessesServices")]
    [PrimaryKey("Id", "BusinessId")]
    public class BusinessService
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }
        [Column(TypeName = "uuid")]
        public Guid BusinessId { get; set; }
        public int? CategoryId {  get; set; }
        public string Name { get; set; } = "";
        [MaxLength(300)]
        public string Description { get; set; } = "";
        public decimal? Price { get; set; }
        public ushort Duration { get; set; }
        public DateTime LastEditDate { get; set; }

        [JsonIgnore]
        [ForeignKey("BusinessId")]
        public Business Business { get; set; }
        [JsonIgnore]
        [ForeignKey("CategoryId, BusinessId")]
        public BusinessServiceCategory Category { get; set; }
    }
}
