import { Injectable } from "@angular/core";
import {DataCache, DataCacheMap} from "../Utils/DataCache";
import { Business } from "./BusinessService";
import { BusinessCategory, BusinessService } from "./ServicesService";
import { User } from "./AuthService";

export type CachedDataInfo = {
    id : number,
    lastEditDate : Date
}

Injectable()
export default class CacheService {
    private businesses : DataCacheMap<number, Business> = new DataCacheMap<number, Business>("Businesses");
    private categories : DataCacheMap<number, BusinessCategory> = new DataCacheMap<number, BusinessCategory>("BusinessesServiceCategories");
    private services : DataCacheMap<number, BusinessService> = new DataCacheMap<number, BusinessService>("BusinessesServices");
    private loggedUser :DataCache<User> = new DataCache<User>("LoggedUser");
    private loggedBusiness : DataCache<Business> = new DataCache<Business>('LoggedBusiness');

    public constructor() {}

    Log() {
        console.log({
            businesses: this.Businesses(),
            categories: this.Categories(),
            services: this.Services(),
            loggedUser: this.GetLoggedUser(),
            loggedBusiness: this.loggedBusiness.Get(),
        });
    }

    public Businesses() {
        return this.businesses.All();
    }

    public GetBusiness(id : number) {
        return this.businesses.Get(id);
    }

    public SetBusiness(id : number, business : Business) {
        this.businesses.Set(id, business);
    }

    public RemoveBusiness(id : number) {
        this.businesses.Delete(id);
    }

    public ClearBusinesses() {
        this.businesses.Clear();
    }
    

    public Categories() {
        return this.categories.All();
    }

    public GetCategory(id : number) {
        return this.categories.Get(id);
    }

    public SetCategory(id : number, category : BusinessCategory) {
        this.categories.Set(id, category);
    }

    public DeleteCategory(id : number) {
        this.categories.Delete(id);
    }

    public ClearCategories() {
        this.categories.Clear();
    }


    public Services() {
        return this.services.All();
    }

    public GetService(id : number) {
        return this.services.Get(id);
    }

    public SetService(id : number, service : BusinessService) {
        this.services.Set(id, service);
    }

    public DeleteService(id : number) {
        this.services.Delete(id);
    }

    public ClearServices() {
        this.services.Clear();
    }




    public GetLoggedUser() : User | null {
        return this.loggedUser.Get();
    }

    public SetLoggedUser(value : User) {
        this.loggedUser.Set(value);
    }

    public DeleteLoggedUser() {
        this.loggedUser.Delete();
    }


    public GetLoggedBusiness() : Business | null {
        return this.loggedBusiness.Get();
    }

    public SetLoggedBusiness(value : Business) {
        this.loggedBusiness.Set(value);
    }

    public DeleteLoggedBusiness() {
        this.loggedBusiness.Delete();
    }
}