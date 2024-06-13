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
        public DbSet<BusinessServiceCategory> BusinessesServicesCategories { get; set; } = default!;
        public DbSet<BusinessHours> BusinessesHours { get; set;} = default!;
        public DbSet<Appointment> Appointments { get; set; } = default!;
        public DbSet<BusinessEmployee> BusinessEmployees { get; set; } = default!;
        public DbSet<BusinessEmployeeHours> BusinessEmployeesHours { get; set;} = default!;

        public DbSet<LocationCountry> LocationCountries { get; set; } = default!;
        public DbSet<LocationState> LocationStates { get; set; } = default!;
        public DbSet<LocationCity> LocationCities { get; set; } = default!;
        public DbSet<LocationTimeZone> LocationTimeZones { get; set; } = default!;
    }
}
