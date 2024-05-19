import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { App } from "../App.component";

export type BusinessInfo = {
    name: string,
    description : string
}


@Injectable()
export default class BusinessService {
    private controllerAddress = App.backendAddress+"business/";

    public constructor(private http : HttpClient) {}

    async GetBusinessInfo() : Promise<BusinessInfo|null> {
        return new Promise<BusinessInfo|null>(resolve => {
            this.http.get<BusinessInfo>(this.controllerAddress, {withCredentials: true}).subscribe({
                next: info => {
                    resolve(info);
                },
                error: err => {
                    if (err.status !== 404)
                        console.error(err);
                    resolve(null);
                }
            });

        })
    }

    async SetupBusiness(name : string, description : string) : Promise<BusinessInfo|null> {
        return new Promise<BusinessInfo|null>(resolve => {
            this.http.post<BusinessInfo>(this.controllerAddress, {name, description}, {withCredentials: true}).subscribe({
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