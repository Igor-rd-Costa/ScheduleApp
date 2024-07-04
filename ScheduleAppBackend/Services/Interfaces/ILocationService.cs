using ScheduleAppBackend.Models;

namespace ScheduleAppBackend.Services.Interfaces
{
    public interface ILocationService
    {
        public Task<List<LocationCountry>> GetCountries();
        public Task<List<LocationState>> GetStates(int countryId);
        public Task<LocationState?> GetState(int stateId);
        public Task<List<LocationCity>> GetCities(int countryId, int stateId);
        public Task<LocationCity?> GetCity(int cityId);
        public Task<LocationTimeZone?> GetTimeZone(int cityId);

    }
}
