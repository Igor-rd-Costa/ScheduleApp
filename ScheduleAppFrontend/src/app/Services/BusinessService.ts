import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { App } from "../App.component";
import { BusinessCategory, BusinessService as BusinessServiceInfo } from "./ServicesService";
import CacheService, { CachedDataInfo } from "./CacheService";

export type Business = {
    id: number,
    name: string,
    description : string
    businessUrl : string
    lastEditDate: Date
}

export type BusinessInfo = {
    business : Business | null | undefined,
    categories : BusinessCategory[] | null,
    services : BusinessServiceInfo[] | null
}

@Injectable()
export default class BusinessService {
    private businessControllerAddress = App.backendAddress+"business/";

    public constructor(private http : HttpClient, private cache : CacheService) {}

    async SearchBusinesses(query : string) {
        query = query.toLowerCase();
        return new Promise<Business[]>(resolve => {
            let cached : CachedDataInfo[] = [];
            this.cache.Businesses().forEach(business => {
                if (business.name.toLowerCase().includes(query)) {
                    cached.push({id: business.id, lastEditDate: business.lastEditDate});
                }
            }) 
            return this.http.get<Business[]>(this.businessControllerAddress+`search?query=${query}&cached=${encodeURIComponent(JSON.stringify(cached))}`, {withCredentials: true}).subscribe({
                next: businesses => {
                    businesses.forEach(business => {
                        this.cache.SetBusiness(business.id, business);
                    });
                    resolve(Array.from(this.cache.Businesses().values()));
                },
                error: err => {
                    console.error(err);
                    resolve([]) ;
                }
            });
        });
    }

    async GetBusiness(url : string | null) : Promise<Business|null> {
        return new Promise<Business|null>(resolve => {
            let cachedBusinessesData : CachedDataInfo | null = null;
            let cachedBusiness : Business | null = null;
            let bUrl = url !== null ? url : (this.cache.GetLoggedBusiness()?.businessUrl);
            if (bUrl) {
                let businesses = Array.from(this.cache.Businesses().values());
                for (let i = 0; i < businesses.length; i++) {
                    if (businesses[i].businessUrl === bUrl) {
                        cachedBusiness = businesses[i];
                        cachedBusinessesData = {
                            id: businesses[i].id,
                            lastEditDate: businesses[i].lastEditDate
                        };
                        break;
                    }
                }
            }

            this.http.get<Business|null>(
                this.businessControllerAddress+`?businessUrl=${url === null ? '' : url}&cache=${cachedBusinessesData !== null ? JSON.stringify(cachedBusiness) : ''}`, 
                {withCredentials: true}).subscribe({
                next: business => {
                    if (business) {
                        this.cache.SetBusiness(business.id, business);
                        if (this.cache.GetLoggedBusiness()?.id === business.id) {
                            this.cache.SetLoggedBusiness(business);
                        }
                        cachedBusiness = business;
                    }
                    resolve(cachedBusiness);
                },
                error: err => {
                    if (err.status !== 404)
                        console.error(err);
                    resolve(null);
                }
            });
        });
    }

    async CreateBusiness(name : string, description : string) : Promise<BusinessInfo|null> {
        return new Promise<BusinessInfo|null>(resolve => {
            this.http.post<BusinessInfo>(this.businessControllerAddress, {name, description}, {withCredentials: true}).subscribe({
                next: result => {
                    resolve(result);
                },
                error: err => {
                    console.error(err);
                    resolve(null);
                }
            })
        })
    }
}