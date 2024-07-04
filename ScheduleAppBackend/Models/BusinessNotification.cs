using Microsoft.EntityFrameworkCore;
using ScheduleAppBackend.Types;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ScheduleAppBackend.Models
{
    [Table("BusinessNotifications")]
    [PrimaryKey("Id", "OwnerId")]
    public class BusinessNotification : NotificationBase
    {
        [ForeignKey("OwnerId")]
        [JsonIgnore]
        Business Business { get; set; } = default!;
    }
}
