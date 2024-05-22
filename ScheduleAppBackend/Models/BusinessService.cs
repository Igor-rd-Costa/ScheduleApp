using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ScheduleAppBackend.Models
{
    [Table("BusinessesServices")]
    [PrimaryKey("Id")]
    public class BusinessService
    {
        public int Id { get; set; }
        public int BusinessId { get; set; }
        public int? CategoryId {  get; set; }
        public string Name { get; set; } = "";
        [MaxLength(300)]
        public string Description { get; set; } = "";
        public decimal? Price { get; set; }
        public ushort Duration { get; set; }

        [ForeignKey("BusinessId")]
        public Business Business { get; set; }
        [ForeignKey("CategoryId")]
        public BusinessServiceCategory Category { get; set; }
    }
}
