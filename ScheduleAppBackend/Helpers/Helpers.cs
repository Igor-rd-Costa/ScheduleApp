using System.Text.Json.Nodes;

namespace ScheduleAppBackend.Helpers
{
    public class Cache
    {
        public List<int> CachedIds { get; set; } = [];
        public Dictionary<int, DateTime> CachedDates { get; set; } = [];
    }
    public class HelperFunctions
    {
        public static Cache ParseCacheStringArray(string cacheString)
        {
            Cache cache = new Cache();
            var cachedArray = JsonArray.Parse(cacheString);

            if (cachedArray != null)
            {
                foreach (var item in cachedArray.AsArray())
                {
                    if (item == null)
                        continue;
                    var obj = item.AsObject();
                    int id = obj["id"]?.GetValue<int>() ?? -1;
                    DateTime date = obj["lastEditDate"]?.GetValue<DateTime>() ?? DateTime.UnixEpoch;
                    cache.CachedIds.Add(id);
                    cache.CachedDates[id] = date;
                }
            }
            return cache;
        }

        public static Cache ParseCacheStringObject(string cacheString)
        {
            Cache cache = new Cache();
            var cachedObject = JsonObject.Parse(cacheString)?.AsObject();

            if (cachedObject != null)
            {
                int id = cachedObject["id"]?.GetValue<int>() ?? -1;
                DateTime date = cachedObject["lastEditDate"]?.GetValue<DateTime>() ?? DateTime.UnixEpoch;
                cache.CachedIds.Add(id);
                cache.CachedDates[id] = date;
            }
            return cache;
        }
    }
}
