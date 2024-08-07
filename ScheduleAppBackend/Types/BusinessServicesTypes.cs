﻿using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ScheduleAppBackend.Types
{
    public class BusinessServiceData
    {
        public int Id { get; set; }
        public string BusinessId { get; set; } = "";
        public int? CategoryId { get; set; }
        public string Name { get; set; } = "";
        [MaxLength(300)]
        public string Description { get; set; } = "";
        public decimal? Price { get; set; }
        public ushort Duration { get; set; }
        public DateTime LastEditDate { get; set; }
    }

    public class CreationResult
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
    }

    public class CreateServiceInfo
    {
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
        public string? Icon { get; set; } = null;
        public decimal? Price { get; set; }
        public ushort Duration { get; set; }
        public int? CategoryId { get; set; }
    }
    public class UpdateServiceInfo
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
        public string? Icon { get; set; } = null;
        public decimal? Price { get; set; }
        public ushort Duration { get; set; }
        public int? CategoryId { get; set; }
    }
    public class DeleteServiceInfo
    {
        public int Id { get; set; }
    }

    public class CreateCategoryInfo
    {
        public string Name { get; set; } = "";
    }
    public class UpdateCategoryInfo
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
    }
    public class DeleteCategoryInfo
    {
        public int Id { get; set; }
        public bool DeleteServices { get; set; }
    }
}
