import { HttpClient } from "@angular/common/http";
import { Injectable, WritableSignal } from "@angular/core";
import { App } from "../App.component";
import { BusinessCategory, BusinessService as BusinessServiceInfo } from "./ServicesService";
import CacheService, { CachedDataInfo } from "./CacheService";
import { User } from "./AuthService";
import { Appointment } from "./ScheduleService";

export type Business = {
    id: string,
    name: string,
    description : string,
    businessUrl : string,
    address : string,
    addressNumber : number,
    countryId : number,
    stateId : number,
    cityId : number,
    hasUnseenNotifications: boolean,
    lastEditDate: Date,
}

export type BusinessCreateInfo = {
    name : string,
    description : string,
    address : string,
    addressNumber : number,
    country : number,
    state : number,
    city : number
}

export type BusinessInfo = {
    business : WritableSignal<Business | null | undefined>,
    categories : BusinessCategory[] | null,
    services : BusinessServiceInfo[] | null
}

@Injectable()
export default class BusinessService {
    private businessControllerAddress = App.backendAddress+"business/";

    public constructor(private http : HttpClient, private cache : CacheService) {}

    async SearchBusinesses(query : string) {
        query = query.toLowerCase();
        return new Promise<Business[]>(async resolve => {
            const cachedBusinesses = await this.cache.BusinessesWhere(
                (business) => business.name.toLowerCase().includes(query)
            );
            const cachedData : CachedDataInfo<string>[] = cachedBusinesses.map(
                business => ({id: business.id, lastEditDate: business.lastEditDate } as CachedDataInfo<string>)
            );
            const cacheString = JSON.stringify(cachedData);
            this.http.get<Business[]>(this.businessControllerAddress+`search?query=${query}&cached=${encodeURIComponent(cacheString)}`, {withCredentials: true}).subscribe({
                next: async businesses => {
                    this.cache.AddBusinesses(businesses);
                    cachedBusinesses.push(...businesses);
                    resolve(cachedBusinesses);
                },
                error: err => {
                    console.error(err);
                    resolve([]);
                }
            });
        });
    }

    async GetBusinessById(id : string | null) : Promise<Business | null> {
        return new Promise<Business | null>(async resolve => {
            let cachedBusinessesData : CachedDataInfo<string> | null = null;
            let cachedBusiness : Business | null = null;
            let bId = id !== null ? id : (this.cache.GetLoggedBusiness()?.id);
            if (bId) {
                let businesses = await this.cache.Businesses();
                for (let i = 0; i < businesses.length; i++) {
                    if (businesses[i].id === bId) {
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
                this.businessControllerAddress+`?id=${bId === null ? '' : bId}&cache=${cachedBusinessesData !== null ? JSON.stringify(cachedBusiness) : '{}'}`, 
                {withCredentials: true}).subscribe({
                next: business => {
                    if (business) {
                        this.cache.AddBusiness(business);
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

    async GetBusiness(url : string | null) : Promise<Business|null> {
        return new Promise<Business|null>(async resolve => {
            let cachedBusinessesData : CachedDataInfo<string> | null = null;
            let cachedBusiness : Business | null = null;
            let bUrl = url !== null ? url : (this.cache.GetLoggedBusiness()?.businessUrl);
            if (bUrl) {
                let businesses = await this.cache.Businesses();
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
                this.businessControllerAddress+`?businessUrl=${url === null ? '' : url}&cache=${cachedBusinessesData !== null ? JSON.stringify(cachedBusiness) : '{}'}`, 
                {withCredentials: true}).subscribe({
                next: business => {
                    if (business) {
                        this.cache.AddBusiness(business);
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

    async GetBusinessEmployee(businessId : string, employeeId : string) : Promise<User|null> {
        return new Promise<User|null>(resolve => {
            this.http.get<User>(this.businessControllerAddress+"employee"+`?businessId=${businessId}&id=${employeeId}&cache=[]`).subscribe({
                next: employee => {
                    resolve(employee);
                },
                error: err => {
                    console.error(err);
                    resolve(null);
                }
            })
        })
    }

    async GetBusinessEmployees(businessId : string | null) : Promise<User[]> {
        return new Promise<User[]>(resolve => {
            this.http.get<User[]>(this.businessControllerAddress+"employees"+`?businessId=${businessId !== null ? businessId : ''}&cache=[]`, {withCredentials: true}).subscribe({
                next: employees => {
                    resolve(employees);
                },
                error: err => {
                    console.error(err);
                    resolve([]);
                }
            })
        });
    }

    async GetAppointments(): Promise<Appointment[]> {
        return new Promise<Appointment[]>(resolve => {
            this.http.get<Appointment[]>(this.businessControllerAddress+"appointments?cache=[]", {withCredentials: true}).subscribe({
                next: appointments => {
                    resolve(appointments);
                },
                error: err => {
                    console.error(err);
                    resolve([]);
                }
            })
        })
    }

    async GetPastAppointments(): Promise<Appointment[]> {
        return new Promise<Appointment[]>(resolve => {
            this.http.get<Appointment[]>(this.businessControllerAddress+"past-appointments?cache=[]", {withCredentials: true}).subscribe({
                next: pastAppointments => {
                    resolve(pastAppointments);
                },
                error: err => {
                    console.error(err);
                    resolve([]);
                }
            });
        });
    }

    async CreateBusiness(info : BusinessCreateInfo) : Promise<Business | null> {
        return new Promise<Business | null>(resolve => {
            this.http.post<Business>(this.businessControllerAddress, info, {withCredentials: true}).subscribe({
                next: result => {
                    console.log("Got result", result);
                    this.cache.SetLoggedBusiness(result);
                    this.cache.AddBusiness(result);
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