namespace ScheduleAppBackend.Types
{
    public class CreationResult
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
    }

    public class CreateServiceInfo
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal? Price { get; set; }
        public ushort Duration { get; set; }
        public int? CategoryId { get; set; }
    }
    public class UpdateServiceInfo
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
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
        public string Name { get; set; }
    }
    public class UpdateCategoryInfo
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
    public class DeleteCategoryInfo
    {
        public int Id { get; set; }
        public bool DeleteServices { get; set; }
    }
}
