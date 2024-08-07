import { Injectable } from "@angular/core";
import {DataCache, DataCacheMap} from "../Utils/DataCache";
import { Business } from "./BusinessService";
import { BusinessCategory, BusinessService } from "./ServicesService";
import { User } from "./AuthService";
import { CacheTable } from "../Utils/CacheTable";
import { BusinessHours } from "./BusinessHoursService";
import { City, Country, State } from "./LocationService";

/* TODO: 
    Add indexes to tables
    Refactore xWhere() functions
*/

export type CachedDataInfo<T> = {
    id : T,
    lastEditDate : Date
}

Injectable()
export default class CacheService {
    private static cacheDB : IDBDatabase | null = null;
    private businesses : CacheTable<Business> | null = null;
    private categories : CacheTable<BusinessCategory> | null = null;
    private businessHours : CacheTable<BusinessHours> | null = null;
    private services : CacheTable<BusinessService> | null = null;

    private locationCountries : CacheTable<Country> | null = null;
    private locationStates : CacheTable<State> | null = null;
    private locationCities : CacheTable<City> | null = null;
    //private locationTimeZones : CacheTable<> | null = null;

    private loggedUser :DataCache<User|null> = new DataCache<User>("LoggedUser");
    private loggedBusiness : DataCache<Business|null> = new DataCache<Business>('LoggedBusiness');

    public constructor() {
        let request = window.indexedDB.open("ScheduleAppDB", 1);
        request.onupgradeneeded = (() => {
            CacheService.cacheDB = request.result;
            this.SetupTables();
        }).bind(this);
        request.onerror = () => {
            console.error("[IDB Error] Open failed", request.error);
        }
        request.onsuccess = () => {
            CacheService.cacheDB = request.result;
            this.businesses = new CacheTable<Business>("Businesses");
            this.services = new CacheTable<BusinessService>("BusinessesServices");
            this.categories = new CacheTable<BusinessCategory>("BusinessesCategories");
            this.businessHours = new CacheTable<BusinessHours>("BusinessesHours");
            this.locationCountries = new CacheTable<Country>("LocationCountries");
            this.locationStates = new CacheTable<State>("LocationStates");
            this.locationCities = new CacheTable<City>("LocationCities");
        }
    }

    static GetDBInstance() {
        return this.cacheDB;
    }

    public async Businesses() {
        return await this.businesses?.All() ?? [];
    }

    public async GetBusiness(id : number) {
        return await this.businesses?.Get(id) ?? null;
    }

    public async BusinessesWhere(compFunc : (business : Business) => boolean) {
        const businesses = await this.Businesses();
        const results : Business[] = [];
        for (let i = 0; i < businesses.length; i++) {
            if (compFunc(businesses[i]))
                results.push(businesses[i]);
        }
        return results;
    }

    public async AddBusiness(business : Business) {
        return await this.businesses?.Add(business) ?? false;
    }

    public async AddBusinesses(businesses : Business[]) {
        return await this.businesses?.AddRange(businesses) ?? false;
    }

    public async DeleteBusiness(id : number) {
        return await this.businesses?.Delete(id) ?? false;
    }

    public async ClearBusinesses() {
        return await this.businesses?.Clear() ?? false;
    }
    

    public async Categories() {
        return await this.categories?.All() ?? [];
    }

    public async CategoriesWhere(compFunc : (category : BusinessCategory) => boolean) {
        const categories = await this.Categories();
        const results : BusinessCategory[] = [];
        for (let i = 0; i < categories.length; i++) {
            if (compFunc(categories[i]))
                results.push(categories[i]);
        }
        return results;
    }

    public async GetCategory(id : number) {
        return await this.categories?.Get(id) ?? null;
    }

    public async AddCategory(category : BusinessCategory) {
        return await this.categories?.Add(category) ?? false;
    }

    public async AddCategories(categories : BusinessCategory[]) {
        return await this.categories?.AddRange(categories) ?? false;
    }

    public async DeleteCategory(id : number) {
        return await this.categories?.Delete(id) ?? false;
    }

    public async DeleteCategories(ids : number[]) {
        return await this.categories?.DeleteRange(ids) ?? false;
    }

    public async ClearCategories() {
        return await this.categories?.Clear() ?? false;
    }


    public async Services() {
        return await this.services?.All() ?? [];
    }

    public async ServicesWhere(compFunc : (service : BusinessService) => boolean) {
        const services = await this.Services();
        const results : BusinessService[] = [];
        for (let i = 0; i < services.length; i++) {
            if (compFunc(services[i]))
                results.push(services[i]);
        }
        return results;
    }

    public async GetService(id : number, businessId : string) {
        const service = await this.services?.Get(id) ?? null;
        if (service !== null && service.businessId === businessId)
            return service;
        return null;
    }

    public async AddService(service : BusinessService) {
        return await this.services?.Add(service) ?? false;
    }

    public async AddServices(services : BusinessService[]) {
        return await this.services?.AddRange(services) ?? false;
    }

    public async DeleteService(id : number) {
        return await this.services?.Delete(id) ?? false;
    }

    public async DeleteServices(ids : number[]) {
        return await this.services?.DeleteRange(ids) ?? false;
    }

    public async ClearServices() {
        return await this.services?.Clear() ?? false;
    }

    public async BusinessesHours() {
        return await this.businessHours?.All() ?? [];
    }

    public async BusinessHoursWhere(compFn : (val : BusinessHours) => boolean) {
        const businessHours = await this.BusinessesHours();
        let results : BusinessHours[] = [];
        businessHours.forEach(bh => {
            if (compFn(bh))
                results.push(bh);
        });
        return results;
    }

    public async AddBusinessHour(hour : BusinessHours) {
        return await this.businessHours?.Add(hour) ?? false;
    }

    public async AddBusinessHours(hours : BusinessHours[]) {
        return await this.businessHours?.AddRange(hours) ?? false;
    }

    public async DeleteBusinessHours(hourIds : number[]) {
        return await this.businessHours?.DeleteRange(hourIds) ?? false;
    }

    public async ClearBusinessesHours() {
        return await this.businessHours?.Clear() ?? false;
    }


    public async AddLocationCountries(countries : Country[]) {
        return await this.locationCountries?.AddRange(countries) ?? false;
    }

    public async GetLocationCountries() {
        return await this.locationCountries?.All() ?? [];
    }

    public async GetLocationCountry(countryId: number) {
        return (await this.locationCountries?.Where(c => c.id == countryId) ?? [])[0] ?? null;
    }

    public async AddLocationStates(states : State[]) {
        return await this.locationStates?.AddRange(states) ?? false;
    }

    public async GetLocationStates(countryId : number) {
        return await this.locationStates?.Where(s => s.countryId === countryId) ?? [];
    }

    public async GetLocationState(stateId : number) {
        const s = await this.locationStates?.Where(s => s.id === stateId) ?? [];
        if (s.length === 0)
            return null;
        return s[0];
    }

    public async AddLocationCities(cities : City[]) {
        return await this.locationCities?.AddRange(cities) ?? false;
    }

    public async GetLocationCities(countryId : number, stateId : number) {
        return await this.locationCities?.Where(c => c.countryId === countryId && c.stateId === stateId) ?? [];
    }

    public async GetLocationCity(cityId : number) {
        return await this.locationCities?.Get(cityId) ?? null;
    }




    public GetLoggedUser() : User | null {
        return this.loggedUser.Get();
    }

    public SetLoggedUser(value : User | null) {
        this.loggedUser.Set(value);
    }

    public GetLoggedBusiness() : Business | null {
        return this.loggedBusiness.Get();
    }

    public SetLoggedBusiness(value : Business | null) {
        this.loggedBusiness.Set(value);
    }

    private SetupTables() {
        const db = CacheService.cacheDB;
        if (!db)
            return;

        db.createObjectStore("Businesses", { keyPath: 'businessUrl' });
        db.createObjectStore("BusinessesServices", {keyPath: 'id'});
        db.createObjectStore("BusinessesCategories", {keyPath: 'id'});
        db.createObjectStore("BusinessesHours", {keyPath: 'id'});
        db.createObjectStore("LocationCountries", {keyPath: 'id'});
        db.createObjectStore("LocationStates", {keyPath: 'id'});
        db.createObjectStore("LocationCities", {keyPath: 'id'});
    }
}