import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { App } from "../App.component";
import CacheService, { CachedDataInfo } from "./CacheService";
import { Business } from "../Pages/Business/Business.component";
import BusinessServiceService from "./BusinessService";

export type BusinessService = {
    id: number,
    businessId: number,
    categoryId: number | null,
    name: string,
    description: string,
    duration: number,
    price: number | null,
    lastEditDate: Date
}

export type BusinessCategory = {
    id : number,
    businessId : number,
    name: string,
    lastEditDate: Date
}

type CreationResult = {
    id: number,
    date: Date
}

export type CategoryDeleteInfo = {
    categoryId : number,
    deleteServices : boolean
}

@Injectable()
export class ServicesService {
    private controllerAddress = App.backendAddress+"business-service/";

    public constructor(private http : HttpClient, private cache : CacheService) {}

    async GetServices(businessId : number | null) {
        return new Promise<BusinessService[]>(resolve => {
            let cachedServicesData : CachedDataInfo[] = [];
            let cachedServices : BusinessService[] = [];
            let bId = businessId !== null ? businessId : this.cache.GetLoggedBusiness()?.id ?? -1;
            this.cache.Services().forEach(service => {
                if(service.businessId === bId) {
                    cachedServicesData.push({id: service.id, lastEditDate: service.lastEditDate});
                    cachedServices.push(service);
                } else {
                }
            });
            this.http.get<BusinessService[]>(this.controllerAddress+`?businessId=${businessId !== null ? businessId : ''}&cache=${JSON.stringify(cachedServicesData)}`, {withCredentials: true}).subscribe({
                next: services => {
                services.forEach(service => {
                    this.cache.SetService(service.id, service);
                });
                cachedServices.push(...services);
                resolve(cachedServices);
            },
            error: err => {
                console.error(err);
                resolve([]);
            }
        });
    });
    }

    async AddService(name : string, description : string, price : number | null, duration : number, categoryId : number | null) {
        return new Promise<CreationResult>(resolve => {
            let businessId = this.cache.GetLoggedBusiness()?.id;
            if (!businessId) {
                resolve({id: -1, date: new Date(0)});
                return;
            }
            this.http.post<CreationResult>(this.controllerAddress, {name, description, price, duration, categoryId}, {withCredentials: true}).subscribe({
                next: result => {
                    this.cache.SetService(result.id, {
                        id: result.id,
                        businessId: businessId,
                        categoryId: categoryId,
                        name: name,
                        description: description,
                        price: price,
                        duration: duration,
                        lastEditDate: result.date
                    });
                    console.log("Added Service to cache", this.cache.GetService(result.id));
                    resolve(result);
                },
                error: err => {
                    console.error(err);
                    resolve({id: -1, date: new Date(0)});
                }
            });
        });
    }

    async UpdateService(id : number, name : string, description : string, price : number | null, duration : number, categoryId : number | null) {
        return new Promise<boolean>(resolve => {
            let businessId = this.cache.GetLoggedBusiness()?.id;
            if (!businessId) {
                resolve(false);
                return;
            }
            this.http.patch<Date>(this.controllerAddress, {id, name, description, price, duration, categoryId}, {withCredentials: true}).subscribe({
                next: date => {
                    let service : BusinessService = {
                        id: id,
                        businessId: businessId,
                        categoryId: categoryId,
                        name: name,
                        description: description,
                        price: price,
                        duration: duration,
                        lastEditDate: date
                    }
                    this.cache.DeleteService(service.id);
                    this.cache.SetService(service.id, service);
                    resolve(true);
                },
                error: err => {
                    console.error(err);
                    resolve(false);
                }
            });
        });
    }

    async DeleteService(id : number) {
        return new Promise<boolean>(resolve => {
            this.http.delete(this.controllerAddress, {body: {id}, withCredentials: true}).subscribe({
                next: () => {
                    this.cache.DeleteService(id);
                    resolve(true);
                },
                error: err => {
                    console.error(err);
                    resolve(false);
                }
            });
        });
    }

    GetCategoryName(id : number) {
        return this.cache.GetCategory(id)?.name;
    }

    async GetCategories(businessId : number | null) {
        return new Promise<BusinessCategory[]>(resolve => {
            let cachedCategoriesData : CachedDataInfo[] = [];
            let cachedCategories : BusinessCategory[] = [];
            let bId = businessId !== null ? businessId : this.cache.GetLoggedBusiness()?.id ?? -1;
            const cache = this.cache.Categories();
            cache.forEach(category => {
                if(category.businessId === bId) {
                    cachedCategoriesData.push({id: category.id, lastEditDate: category.lastEditDate});
                    cachedCategories.push(category);
                }
            });
            const cacheString = JSON.stringify(cachedCategoriesData);
            this.http.get<BusinessCategory[]>(this.controllerAddress+`category?businessId=${businessId !== null ? businessId : ''}&cache=${cacheString}`, {withCredentials: true}).subscribe({
                next: categories => {
                    categories.forEach(category => {
                        this.cache.SetCategory(category.id, category);
                    })
                    cachedCategories.push(...categories);
                    resolve(cachedCategories);
                },
                error: err => {
                    console.error(err);
                    resolve([]);
                }
            });
        });
    }

    async AddCategory(name : string) {
        return new Promise<CreationResult>(resolve => {
            let businessId = this.cache.GetLoggedBusiness()?.id;
            if (!businessId) {
                resolve({id: -1, date: new Date(0)});
                return;
            }
            this.http.post<CreationResult>(this.controllerAddress+"category", {name}, {withCredentials: true}).subscribe({
                next: result => {
                    this.cache.SetCategory(result.id, {
                        id: result.id,
                        businessId: businessId,
                        name: name,
                        lastEditDate: result.date,
                    });
                    resolve(result);
                },
                error: err => {
                    console.error(err);
                    resolve({id: -1, date: new Date(0)});
                }
            });
        });
    }

    async UpdateCategory(id : number, name : string) {
        return new Promise<boolean>(resolve => {
            let businessId = this.cache.GetLoggedBusiness()?.id;
            if (!businessId) {
                resolve(false);
                return;
            }
            this.http.patch<Date>(this.controllerAddress+"category", {id, name}, {withCredentials: true}).subscribe({
                next: date => {
                    let category : BusinessCategory = {
                        id: id,
                        businessId: businessId,
                        name: name,
                        lastEditDate: date
                    }
                    console.log("Got Here:", date);
                    this.cache.DeleteCategory(id);
                    this.cache.SetCategory(id, category);
                    resolve(true);
                },
                error: err => {
                    console.error(err);
                    resolve(false);
                }
            });
        });
    }

    async DeleteCategory(id : number, deleteServices : boolean) {
        return new Promise<CategoryDeleteInfo>(resolve => {
            this.http.delete(this.controllerAddress+"category", {body: {id, deleteServices}, withCredentials: true}).subscribe({
                next: () => {
                    this.cache.DeleteCategory(id);
                    let services : BusinessService[] = [];
                    this.cache.Services().forEach(service => {
                        if (service.categoryId === id) {
                            services.push(service);
                        }
                    });
                    if (deleteServices) {
                        for (let i = 0; i < services.length; i++) {
                            this.cache.DeleteService(services[i].id);
                        }
                    } else {
                        services.forEach(service => {
                            service.categoryId = null;
                            this.cache.SetService(service.id , service);
                        })
                    }
                    console.log("Resolving", {id, deleteServices})
                    resolve({categoryId: id, deleteServices: deleteServices});
                },
                error: err => {
                    console.error(err);
                    resolve({categoryId: -1, deleteServices: false});
                }
            })
        })
    }
}