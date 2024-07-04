import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { App } from "../App.component";
import CacheService from "./CacheService";

export type Country = {
    id: number,
    isoCode : string,
    name : string,
    currency: string
}

export type State = {
    id: number,
    countryId : number,
    name : string
}

export type City = {
    id : number,
    name : string,
    timeZone : string,
    countryId : number,
    stateId : number
}

@Injectable()
export class LocationService {
    private controllerAddress = App.backendAddress+"location/";

    public constructor(private http : HttpClient, private cacheService : CacheService) {}
    
    public async GetCountries() {
        return new Promise<Country[]>(async resolve => {
            const c = await this.cacheService.GetLocationCountries();
            this.http.get<Country[]>(this.controllerAddress+`countries?cacheCount=${c.length}`, {withCredentials: true}).subscribe({
                next: async countries => {
                    if (countries === null) {
                        resolve(c);
                        return;
                    }
                    this.cacheService.AddLocationCountries(countries);
                    resolve(await this.cacheService.GetLocationCountries());
                },
                error: err => {
                    console.error(err);
                    resolve([]);
                }
            });
        });
    }

    public async GetCountry(countryId: number) {
        return new Promise<Country|null>(async resolve => {
            const c = await this.cacheService.GetLocationCountry(countryId);
            if (c !== null) {
                resolve(c);
                return;
            }
            this.http.get<Country>(this.controllerAddress+`country?countryId=${countryId}`, {withCredentials: true}).subscribe({
                next: country => {
                    this.cacheService.AddLocationCountries([country]);
                    resolve(country);
                },
                error: err => {
                    console.error(err);
                    resolve(null);
                }
            });
        });
    }

    public async GetStates(countryId : number) {
        return new Promise<State[]>(async resolve => {
            const s = await this.cacheService.GetLocationStates(countryId);
            this.http.get<State[]|null>(this.controllerAddress+`states?countryId=${countryId}&cache=${s.length}`, {withCredentials: true}).subscribe({
                next: states => {
                    if (states === null) {
                        resolve(s);
                        return;
                    }   
                    this.cacheService.AddLocationStates(states);
                    resolve(states);
                },
                error: err => {
                    console.error(err);
                    resolve([]);
                }
            });
        });
    }

    public async GetState(stateId : number) {
        return new Promise<State|null>(async resolve => {
            const s = await this.cacheService.GetLocationState(stateId) ?? null;
            if (s !== null) {
                resolve(s);
                return;
            }
            this.http.get<State>(this.controllerAddress+`state?stateId=${stateId}`, {withCredentials: true}).subscribe({
                next: state => {
                    this.cacheService.AddLocationStates([state]);
                    resolve(state);
                },
                error: err => {
                    console.error(err);
                    resolve(null);
                }
            });
        });
    }

    public async GetCities(countryId: number, stateId : number) {
        return new Promise<City[]>(async resolve => {
            const c = await this.cacheService.GetLocationCities(countryId, stateId);
            this.http.get<City[]|null>(this.controllerAddress+`cities?countryId=${countryId}&stateId=${stateId}&cache=${c.length}`, {withCredentials: true}).subscribe({
                next: cities => {
                    if (cities === null) {
                        resolve(c);
                        return;
                    }
                    this.cacheService.AddLocationCities(cities);
                    resolve(cities);
                },
                error: err => {
                    console.error(err);
                    resolve([]);
                }
            });
        });
    }

    public async GetCity(cityId : number) {
        return new Promise<City | null>(async resolve => {
            const c = await this.cacheService.GetLocationCity(cityId);
            if (c !== null) {
                resolve(c);
                return;
            }
            this.http.get<City>(this.controllerAddress+`city?cityId=${cityId}`, {withCredentials: true}).subscribe({
                next: city => {
                    this.cacheService.AddLocationCities([city]);
                    resolve(city);
                },
                error: err => {
                    console.error(err);
                    resolve(null);
                }
            });
        });
    }
}