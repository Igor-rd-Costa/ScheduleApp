﻿using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ScheduleAppBackend.Models
{
    [Table("BusinessesHours")]
    [PrimaryKey("Id")]
    public class BusinessHours
    {
        public int Id { get; set; }
        public int BusinessId { get; set; }
        public DayOfWeek Day {  get; set; }
        public ushort IntervalStart { get; set; }
        public ushort IntervalEnd { get; set; }
        public DateTime LastEditDate { get; set; }

        [ForeignKey("BusinessId")]
        [JsonIgnore]
        public Business Business { get; set; }
    }
}
