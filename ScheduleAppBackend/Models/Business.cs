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
        public string Address { get; set; } = "";
        public int AddressNumber { get; set; }
        [MaxLength(2)]
        public string CountryCode { get; set; } = "";
        public string StateCode { get; set; } = "";
        public int CityCode { get; set; }
        public DateTime LastEditDate { get; set; }
        public bool HasUnseenNotifications { get; set; }

        [JsonIgnore]
        [ForeignKey("OwnerId")]
        public User User { get; set; }
        [JsonIgnore]
        [ForeignKey("CountryCode")]
        public LocationCountry Country { get; set; }
        [JsonIgnore]
        [ForeignKey("StateCode, CountryCode")]
        public LocationState State { get; set; }
        [JsonIgnore]
        [ForeignKey("CityCode")]
        public LocationCity City { get; set; }
    }
}
