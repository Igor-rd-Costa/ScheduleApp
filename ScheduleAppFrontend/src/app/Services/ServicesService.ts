import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { App } from "../App.component";

export type BusinessService = {
    id: number,
    categoryId: number | null,
    name: string,
    description: string,
    duration: number,
    price: number | null,
}

export type BusinessCategory = {
    id : number,
    name: string
}


@Injectable()
export class ServicesService {
    private controllerAddress = App.backendAddress+"business-service/";
    private categories : BusinessCategory[] = []; 
    private services : BusinessService[] = [];

    public constructor(private http : HttpClient) {
        this.GetCategories().then(categories => {
            this.categories = categories;
        });
        this.GetServices().then(services => {
            this.services = services;
        });
    }

    GetServiceCategoryName(id : number) {
        return this.categories.find(c => c.id === id)?.name ?? "";
    }

    GetAllCategories() {
        return this.categories;
    }

    GetAllServices() {
        return this.services;
    }

    async GetServices() {
        return new Promise<BusinessService[]>(resolve => {
            this.http.get<BusinessService[]>(this.controllerAddress, {withCredentials: true}).subscribe({
                next: services => {
                    resolve(services);
                },
                error: err => {
                    console.error(err);
                    resolve([]);
                }
            });
        });
    }

    async AddService(name : string, description : string, price : number | null, duration : number, categoryId : number | null) {
        return new Promise<void>(resolve => {
            this.http.post<number>(this.controllerAddress, {name, description, price, duration, categoryId}, {withCredentials: true}).subscribe({
                next: id => {
                    this.services.push({
                        id: id,
                        categoryId: categoryId,
                        name: name,
                        description: description,
                        price: price,
                        duration: duration
                    });
                    resolve();
                },
                error: err => {
                    console.error(err);
                    resolve();
                }
            });
        });
    }

    async UpdateService(id : number, name : string, description : string, price : number | null, duration : number, categoryId : number | null) {
        return new Promise<void>(resolve => {
            this.http.patch(this.controllerAddress, {id, name, description, price, duration, categoryId}, {withCredentials: true}).subscribe({
                next: () => {
                    for (let i = 0; i < this.services.length; i++) {
                        if (this.services[i].id === id) {
                            let service = this.services[i];
                            service.categoryId = categoryId;
                            service.name = name;
                            service.description = description;
                            service.price = price;
                            service.duration = duration;
                            this.services[i] = service;
                            break;
                        }
                    }
                    resolve();
                },
                error: err => {
                    console.error(err);
                    resolve();
                }
            });
        });
    }

    async DeleteService(id : number) {
        return new Promise<void>(resolve => {
            this.http.delete(this.controllerAddress, {body: {id}, withCredentials: true}).subscribe({
                next: () => {
                    for (let i = 0; i < this.services.length; i++) {
                        if (this.services[i].id === id) {
                            this.services.splice(i, 1);
                            break;
                        }
                    }
                    resolve();
                },
                error: err => {
                    console.error(err);
                    resolve();
                }
            });
        });
    }

    async GetCategories() {
        return new Promise<BusinessCategory[]>(resolve => {
            this.http.get<BusinessCategory[]>(this.controllerAddress+"category", {withCredentials: true}).subscribe({
                next: categories => {
                    resolve(categories);
                },
                error: err => {
                    console.error(err);
                    resolve([]);
                }
            });
        });
    }

    async AddCategory(name : string) {
        return new Promise<void>(resolve => {
            this.http.post<number>(this.controllerAddress+"category", {name}, {withCredentials: true}).subscribe({
                next: result => {
                    this.categories.push({
                        id: result,
                        name: name
                    });
                    resolve();
                },
                error: err => {
                    console.error(err);
                    resolve();
                }
            });
        });
    }

    async UpdateCategory(id : number, name : string) {
        return new Promise<void>(resolve => {
            this.http.patch(this.controllerAddress+"category", {id, name}, {withCredentials: true}).subscribe({
                next: () => {
                    for (let i = 0; i < this.categories.length; i++) {
                        if (this.categories[i].id == id) {
                            let category = this.categories[i];
                            category.name = name;
                            this.categories[i] = category;
                            break;
                        }
                    }
                    resolve();
                },
                error: err => {
                    console.error(err);
                    resolve();
                }
            });
        });
    }

    async DeleteCategory(id : number, deleteServices : boolean) {
        return new Promise<void>(resolve => {
            this.http.delete(this.controllerAddress+"category", {body: {id, deleteServices}, withCredentials: true}).subscribe({
                next: () => {
                    for (let i = 0; i < this.categories.length; i++) {
                        if (this.categories[i].id === id) {
                            this.categories.splice(i, 1);
                            break;
                        }
                    }
                    if (deleteServices) {
                        let s : BusinessService[] = [];
                        for (let i = 0; i < this.services.length; i++) {
                            if (this.services[i].categoryId == id)
                                s.push(this.services[i]);
                        }
                        for (let i = 0; i < s.length; i++) {
                            for (let j = 0; j < this.services.length; j++) {
                                if (this.services[j].id == s[i].id) {
                                    this.services.splice(j, 1);
                                    break;
                                }
                            }
                        }
                    } else {
                        for (let i = 0; i < this.services.length; i++) {
                            if (this.services[i].categoryId == id)
                                this.services[i].categoryId = null;
                        }
                    }
                    resolve();
                },
                error: err => {
                    console.error(err);
                    resolve();
                }
            })
        })
    }
}