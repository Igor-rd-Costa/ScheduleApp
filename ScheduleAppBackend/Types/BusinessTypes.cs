namespace ScheduleAppBackend.Types
{
    public class CachedDataInfo
    {
        public int Id { get; set; }
        public DateTime LastEditDate { get; set; }
    }

    public class CreateBusinessInfo
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
    }
    public class SearchBusinessInfo
    {
        public string Query { get; set; }
        public string Cached { get; set; }
    }
}
