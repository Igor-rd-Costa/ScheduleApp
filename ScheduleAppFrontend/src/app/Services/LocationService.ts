import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { App } from "../App.component";
import CacheService from "./CacheService";
import { state } from "@angular/animations";

export type Country = {
    isoCode : string,
    name : string
}

export type State = {
    code : string,
    countryCode : string,
    name : string
}

export type City = {
    id : number,
    name : string,
    timeZone : string,
    country : string,
    state : string
}

@Injectable()
export class LocationService {
    private controllerAddress = App.backendAddress+"location/";

    public constructor(private http : HttpClient, private cacheService : CacheService) {}
    
    public async GetCountries() {
        return new Promise<Country[]>(async resolve => {
            const c = await this.cacheService.GetLocationCountries();
            if (c.length !== 0) {
                resolve(c);
                return;
            }
            this.http.get<Country[]>(this.controllerAddress+"countries", {withCredentials: true}).subscribe({
                next: countries => {
                    this.cacheService.AddLocationCountries(countries);
                    resolve(countries);
                },
                error: err => {
                    console.error(err);
                    resolve([]);
                }
            });
        });
    }

    public async GetStates(country : string) {
        return new Promise<State[]>(async resolve => {
            const s = await this.cacheService.GetLocationStates(country);
            this.http.get<State[]|null>(this.controllerAddress+`states?country=${country}&cache=${s.length}`, {withCredentials: true}).subscribe({
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

    public async GetState(countryCode : string, stateCode : string) {
        return new Promise<State|null>(async resolve => {
            const s = await this.cacheService.GetLocationState(countryCode, stateCode) ?? null;
            if (s !== null) {
                resolve(s);
                return;
            }
            this.http.get<State>(this.controllerAddress+`state?countryCode=${countryCode}&stateCode=${stateCode}`, {withCredentials: true}).subscribe({
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

    public async GetCities(country: string, state : string) {
        return new Promise<City[]>(async resolve => {
            const c = await this.cacheService.GetLocationCities(country, state);
            this.http.get<City[]|null>(this.controllerAddress+`cities?country=${country}&state=${state}&cache=${c.length}`, {withCredentials: true}).subscribe({
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

    public async GetCity(cityCode : number) {
        return new Promise<City | null>(async resolve => {
            const c = await this.cacheService.GetLocationCity(cityCode);
            if (c !== null) {
                resolve(c);
                return;
                }
            this.http.get<City>(this.controllerAddress+`city?id=${cityCode}`, {withCredentials: true}).subscribe({
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