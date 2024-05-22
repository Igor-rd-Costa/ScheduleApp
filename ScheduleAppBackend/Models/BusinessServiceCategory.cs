using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace ScheduleAppBackend.Models
{
    [Table("BusinessesServicesCategories")]
    [PrimaryKey("Id")]
    public class BusinessServiceCategory
    {
        public int Id { get; set; }
        public int BusinessId { get; set; }
        public string Name { get; set; }

        [ForeignKey("BusinessId")]
        public Business Business { get; set; }
    }
}
