using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ScheduleAppBackend.Models
{
    [Table("Businesses")]
    [PrimaryKey("Id")]
    public class Business
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column(TypeName = "uuid")]
        public Guid Id { get; set; }
        [JsonIgnore] 
        [Column(TypeName = "uuid")]
        public Guid OwnerId { get; set; }
        [MaxLength(100)]
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
        [MaxLength(60)]
        public string BusinessUrl { get; set; } = "";
        public DateTime LastEditDate { get; set; }

        [JsonIgnore]
        [ForeignKey("OwnerId")]
        public User User { get; set; }
    }
}
