using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ScheduleAppBackend.Models
{
    [Table("Businesses")]
    [PrimaryKey("Id")]
    public class Business
    {
        public int Id { get; set; }
        public int OwnerId { get; set; }
        [MaxLength(100)]
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";

        [ForeignKey("OwnerId")]
        public User User { get; set; }
    }
}
