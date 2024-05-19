using Microsoft.EntityFrameworkCore;
using ScheduleAppBackend.Models;


namespace ScheduleAppBackend.Context
{
    public class ScheduleAppContext : DbContext
    {
        public ScheduleAppContext(DbContextOptions<ScheduleAppContext> options)
            : base(options)
        {

        }

        public DbSet<User> Users { get; set; } = default!;
        public DbSet<Business> Businesses { get; set; } = default!;
        public DbSet<BusinessService> BusinessesServices { get; set; } = default!;
        public DbSet<BusinessHours> BusinessesHours { get; set;} = default!;
    }
}
