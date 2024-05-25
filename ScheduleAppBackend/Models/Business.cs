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
        public int Id { get; set; }
        [JsonIgnore]
        public int OwnerId { get; set; }
        [MaxLength(100)]
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
        [MaxLength(60)]
        public string BusinessUrl { get; set; } = "";
        public DateTime LastEditDate { get; set; }

        [ForeignKey("OwnerId")]
        [JsonIgnore]
        public User User { get; set; }
    }
}
