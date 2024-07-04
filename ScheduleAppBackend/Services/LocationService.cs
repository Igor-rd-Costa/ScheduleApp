using ScheduleAppBackend.Context;
using ScheduleAppBackend.Models;
using ScheduleAppBackend.Services.Interfaces;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace ScheduleAppBackend.Services
{
    public class LocationService : ILocationService
    {
        private readonly ScheduleAppContext m_Context;
        private readonly HttpClient m_Http;
        private readonly string m_GeoNamesAddress = "https://secure.geonames.org/";
        private readonly string m_GeoNamesUsername;

        private class GeoNamesCountry
        {
            [JsonPropertyName("geonameId")]
            public int GeonameId {  get; set; }
            [JsonPropertyName("countryCode")]
            public string CountryCode { get; set; } = "";
            [JsonPropertyName("countryName")]
            public string CountryName { get; set; } = "";
            [JsonPropertyName("currencyCode")]
            public string CountryCurrency { get; set; } = "";
        }

        private class GeoNamesState
        {
            [JsonPropertyName("geonameId")]
            public int GeonameId { get; set; }
            [JsonPropertyName("name")]
            public string Name { get; set; } = "";
            [JsonPropertyName("fcode")]
            public string FCode { get; set; } = "";
        }

        private class GeoNamesTimeZone
        {
            [JsonPropertyName("gmtOffset")]
            public int GmtOffset { get; set; }
            [JsonPropertyName("timeZoneId")]
            public string TimeZoneId { get; set; } = "";
        }

        private class GeoNamesCity
        {
            [JsonPropertyName("geonameId")]
            public int GeonameId { get; set; }
            [JsonPropertyName("name")]
            public string Name { get; set; } = "";
            [JsonPropertyName("fcode")]
            public string FCode { get; set; } = "";
            [JsonPropertyName("timezone")]
            public GeoNamesTimeZone TimeZone { get; set; } = default!;
        }

        private class GeoNamesCountryResponse
        {
            public List<GeoNamesCountry> geonames { get; set; } = [];
        }

        private class GeoNamesStateResponse
        {
            public List<GeoNamesState> geonames { get; set; } = [];
        }

        private class GeoNamesCityResponse
        {
            public List<GeoNamesCity> geonames { get; set; } = [];
        }

        public LocationService(ScheduleAppContext context, HttpClient http, IConfiguration configuration)
        {
            m_Context = context;
            m_Http = http;
            m_GeoNamesUsername = configuration.GetConnectionString("GeoNamesUsername") ?? "";
        }

        public async Task<List<LocationCountry>> GetCountries()
        {
            List<LocationCountry> countries = [];
            var a = await m_Http.GetAsync(m_GeoNamesAddress+$"countryInfoJSON?username={m_GeoNamesUsername}");
            var response = JsonSerializer.Deserialize<GeoNamesCountryResponse>(await a.Content.ReadAsStringAsync());
            if (response == null)
                return countries;
            countries = response.geonames.Select(c => new LocationCountry()
            {
                Id = c.GeonameId,
                ISOCode = c.CountryCode,
                Name = c.CountryName,
                Currency = c.CountryCurrency,
            }).ToList();
            return countries;
        }

        public async Task<List<LocationState>> GetStates(int countryId)
        {
            List<LocationState> states = [];
            var request = await m_Http.GetAsync(m_GeoNamesAddress + $"childrenJSON?geonameId={countryId}&username={m_GeoNamesUsername}");
            var response = JsonSerializer.Deserialize<GeoNamesStateResponse>(await request.Content.ReadAsStringAsync());
            if (response == null)
                return states;
            states = response.geonames.Where(s => s.FCode == "ADM1").Select(s => new LocationState()
            {
                Id = s.GeonameId,
                CountryId = countryId,
                Name = s.Name
            }).ToList();
            return states;
        }

        public async Task<LocationState?> GetState(int stateId)
        {
            LocationState? state = null;
            return state;
        }

        public async Task<List<LocationCity>> GetCities(int countryId, int stateId) 
        {
            List<LocationCity> cities = [];
            var request = await m_Http.GetAsync(m_GeoNamesAddress + $"childrenJSON?geonameId={stateId}&username={m_GeoNamesUsername}");
            var response = JsonSerializer.Deserialize<GeoNamesCityResponse>(await request.Content.ReadAsStringAsync());
            if (response == null)
                return cities;
            cities = response.geonames.Where(s => s.FCode == "ADM2").Select(s => new LocationCity()
            {
                Id = s.GeonameId,
                CountryId = countryId,
                StateId = stateId,
                TimeZoneId = null,
                Name = s.Name
            }).ToList();
            return cities;
        }

        public async Task<LocationCity?> GetCity(int cityId)
        {
            LocationCity? city = null;
            return city;
        }
        public async Task<LocationTimeZone?> GetTimeZone(int cityId)
        {
            LocationTimeZone? timeZone = null;
            var request = await m_Http.GetAsync(m_GeoNamesAddress + $"getJSON?geonameId={cityId}&username={m_GeoNamesUsername}");
            var response = JsonSerializer.Deserialize<GeoNamesCity>(await request.Content.ReadAsStringAsync());
            if (response == null)
                return timeZone;

            timeZone = new LocationTimeZone()
            {
                Name = response.TimeZone.TimeZoneId,
                Offset = response.TimeZone.GmtOffset
            };
            return timeZone;
        }
    }
}
