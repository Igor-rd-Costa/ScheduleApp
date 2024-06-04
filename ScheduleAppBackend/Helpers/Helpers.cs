using System;
using System.Globalization;
using System.Text;
using System.Text.Json.Nodes;

namespace ScheduleAppBackend.Helpers
{
    public class Cache<T> where T : notnull
    {
        public List<T> CachedIds { get; set; } = [];
        public Dictionary<T, DateTime> CachedDates { get; set; } = [];
    }

    public class HelperFunctions
    {
        public static Cache<int> ParseIntCacheStringArray(string cacheString)
        {
            Cache<int> cache = new Cache<int>();
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

        public static Cache<Guid> ParseGuidCacheStringArray(string cacheString)
        {
            Cache<Guid> cache = new Cache<Guid>();
            var cachedArray = JsonArray.Parse(cacheString);

            if (cachedArray != null)
            {
                foreach (var item in cachedArray.AsArray())
                {
                    if (item == null)
                        continue;
                    var obj = item.AsObject();
                    Guid id = obj["id"]?.GetValue<Guid>() ?? Guid.Empty;
                    DateTime date = obj["lastEditDate"]?.GetValue<DateTime>() ?? DateTime.UnixEpoch;
                    cache.CachedIds.Add(id);
                    cache.CachedDates[id] = date;
                }
            }
            return cache;
        }

        public static Cache<int> ParseIntCacheStringObject(string cacheString)
        {
            Cache<int> cache = new Cache<int>();
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

        public static Cache<Guid> ParseGuidCacheStringObject(string cacheString)
        {
            Cache<Guid> cache = new Cache<Guid>();
            var cachedObject = JsonObject.Parse(cacheString)?.AsObject();

            if (cachedObject != null)
            {
                Guid id = cachedObject["id"]?.GetValue<Guid>() ?? Guid.Empty;
                DateTime date = cachedObject["lastEditDate"]?.GetValue<DateTime>() ?? DateTime.UnixEpoch;
                cache.CachedIds.Add(id);
                cache.CachedDates[id] = date;
            }
            return cache;
        }

        public static string RemoveDiacritics(string s)
        {
            string normalizedString = s.Normalize(NormalizationForm.FormD);
            StringBuilder stringBuilder = new();

            for (int i = 0; i < normalizedString.Length; i++)
            {
                char c = normalizedString[i];
                if (CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
                {
                    stringBuilder.Append(c);
                }
            }

            return stringBuilder.ToString().Normalize(NormalizationForm.FormC);
        }

        public static ushort MakeHour(int hours, int minutes)
        {
            return (ushort)((hours << 8) + minutes);
        }

        public static ushort HourAddMinutes(ushort hour, ushort minutes)
        {
            int h = hour >> 8;
            int m = hour & 0b11111111;
            m += minutes;
            while (m >= 60)
            {
                m -= 60;
                h += 1;
                if (h == 24)
                    h = 0;
            }
            return (ushort)((h << 8) + m);
        }

        public static string HourToString(ushort hour)
        {
            int h = hour >> 8;
            int m = hour & 0b11111111;
            string hA = h < 10 ? "0" : "";
            string mA = m < 10 ? "0" : "";
            return $"{hA}{h}:{mA}{m}";
        }
    }
}
