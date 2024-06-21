using Microsoft.EntityFrameworkCore;
using ScheduleAppBackend.Types;
using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Cryptography.X509Certificates;
using System.Text.Json.Serialization;

namespace ScheduleAppBackend.Models
{
    [Table("UserNotifications")]
    [PrimaryKey("Id", "OwnerId")]
    public class UserNotification : NotificationBase
    {
        
        [ForeignKey("OwnerId")]
        [JsonIgnore]
        User User { get; set; }
    }
}
