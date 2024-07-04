using System.ComponentModel.DataAnnotations;

namespace ScheduleAppBackend.Types
{
    public class CachedDataInfo<T>
    {
        public T Id { get; set; }
        public DateTime LastEditDate { get; set; }
    }

    public class CreateBusinessInfo
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
        public string Address { get; set; } = "";
        public int AddressNumber { get; set; }
        public int Country { get; set; }
        public int State { get; set; }
        public int City { get; set; }
    }
    public class SearchBusinessInfo
    {
        public string Query { get; set; }
        public string Cached { get; set; }
    }
}
