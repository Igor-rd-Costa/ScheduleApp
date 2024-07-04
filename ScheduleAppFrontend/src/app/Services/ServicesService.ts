import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { App } from "../App.component";
import CacheService, { CachedDataInfo } from "./CacheService";

export type BusinessService = {
    id: number,
    businessId: string,
    categoryId: number | null,
    name: string,
    description: string,
    duration: number,
    price: number | null,
    lastEditDate: Date
}

export type BusinessCategory = {
    id : number,
    businessId : string,
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

    async GetService(id : number, businessId : string) {
        return new Promise<BusinessService | null>(async resolve => {
            let cachedService = await this.cache.GetService(id, businessId);
            const cachedData : CachedDataInfo<number> | null = cachedService === null ? null : {id: cachedService.id, lastEditDate: cachedService.lastEditDate};
            this.http.get<BusinessService>(this.controllerAddress+`?id=${id}&businessId=${businessId}&cache=${JSON.stringify(cachedData ?? {})}`, {withCredentials: true}).subscribe({
                next: service => {
                if (service) {
                    this.cache.AddService(service);
                    cachedService = service;
                }
                resolve(cachedService);
            },
            error: err => {
                console.error(err);
                resolve(null);
            }
        }); 

        });
    }

    async GetServices(businessId : string | null) {
        return new Promise<BusinessService[]>(async resolve => {
            let bId = businessId !== null ? businessId : this.cache.GetLoggedBusiness()?.id ?? -1;
            const cachedServices : BusinessService[] = await this.cache.ServicesWhere(
                (service => service.businessId === bId)
            );
            const cachedServicesData : CachedDataInfo<number>[] = cachedServices.map(
                service => ({id: service.id, lastEditDate: service.lastEditDate} as CachedDataInfo<number>)
            );
            this.http.get<BusinessService[]>(this.controllerAddress+"all"+`?businessId=${businessId !== null ? businessId : ''}&cache=${JSON.stringify(cachedServicesData)}`, {withCredentials: true}).subscribe({
                next: services => {
                this.cache.AddServices(services);
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
            let bId = this.cache.GetLoggedBusiness()?.id;
            if (!bId) {
                resolve({id: -1, date: new Date(0)});
                return;
            }
            this.http.post<CreationResult>(this.controllerAddress, {name, description, price, duration, categoryId}, {withCredentials: true}).subscribe({
                next: result => {
                    this.cache.AddService({
                        id: result.id,
                        businessId: bId,
                        categoryId: categoryId,
                        name: name,
                        description: description,
                        price: price,
                        duration: duration,
                        lastEditDate: result.date
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
                    this.cache.AddService(service);
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

    async GetCategoryName(id : number) {
        return (await this.cache.GetCategory(id))?.name;
    }

    async GetCategories(businessId : string | null) {
        return new Promise<BusinessCategory[]>(async resolve => {
            let bId = businessId !== null ? businessId : this.cache.GetLoggedBusiness()?.id ?? -1;
            const cachedCategories = await this.cache.CategoriesWhere(
                (category => category.businessId === bId)
            );
            let cachedCategoriesData : CachedDataInfo<number>[] = cachedCategories.map(
                category => ({id: category.id, lastEditDate: category.lastEditDate} as CachedDataInfo<number>)
            );
            this.http.get<BusinessCategory[]>(this.controllerAddress+`category?businessId=${businessId !== null ? businessId : ''}&cache=${JSON.stringify(cachedCategoriesData)}`, {withCredentials: true}).subscribe({
                next: categories => {
                    this.cache.AddCategories(categories);
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
            console.log("Got", businessId);
            if (!businessId) {
                resolve({id: -1, date: new Date(0)});
                return;
            }
            this.http.post<CreationResult>(this.controllerAddress+"category", {name}, {withCredentials: true}).subscribe({
                next: result => {
                    this.cache.AddCategory({
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
                    this.cache.AddCategory(category);
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
        return new Promise<CategoryDeleteInfo>(async resolve => {
            this.http.delete(this.controllerAddress+"category", {body: {id, deleteServices}, withCredentials: true}).subscribe({
                next: async () => {
                    this.cache.DeleteCategory(id);
                    const services : BusinessService[] = await this.cache.ServicesWhere(
                        service => service.categoryId === id
                    );
                    if (deleteServices) {
                        this.cache.DeleteServices(services.map(service => service.id));
                    } else {
                        services.forEach(service => {
                            service.categoryId = null;
                        });
                        this.cache.AddServices(services);
                    }
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