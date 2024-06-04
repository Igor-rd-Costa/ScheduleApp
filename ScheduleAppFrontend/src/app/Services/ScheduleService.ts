import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { App } from "../App.component";
import { BusinessService } from "./ServicesService";
import { Hour } from "../Utils/Time";

export type Appointment = {
    id: number,
    businessId : string,
    clientId : string,
    employeeId : string,
    serviceId : number,
    time : Date
}

@Injectable()
export class ScheduleService {
    private controllerAddress = App.backendAddress+"schedule/";

    public constructor(private http : HttpClient) {}

    async GetAppointments() {
        return new Promise<Appointment[]>(resolve => {
            this.http.get<Appointment[]>(this.controllerAddress+`?cache=[]`, {withCredentials: true}).subscribe({
                next: appointments => {
                    resolve(appointments);
                },
                error: err => {
                    console.error(err);
                    resolve([]);
                }
            })

        });
    }

    async GetScheduleInfo(id : number, businessId : string) {
        return new Promise<BusinessService|null>(resolve => {
            this.http.get<BusinessService>(this.controllerAddress+`info?id=${id}&businessId=${businessId}&cache=[]`, {withCredentials: true}).subscribe({
                next: info => {
                    resolve(info);
                },
                error: err => {
                    console.error(err);
                    resolve(null);
                }
            })
        })
    }

    async GetAvailableTimes(id : number, businessId : string, date : Date) : Promise<Hour[]> {
        return new Promise<Hour[]>(resolve => {
            this.http.get<Hour[]>(this.controllerAddress+`available-times?id=${id}&businessId=${businessId}&date=${this.BuildQueryDate(date)}`, {withCredentials: true}).subscribe({
                next: availableTimes => {
                    resolve(availableTimes);
                },
                error: err => {
                    console.error(err);
                    resolve([]);
                }
            })
        })
    }

    async Schedule(serviceId : number, businessId : string, employeeId : string, time : Date) {
        return new Promise<boolean>(resolve => {
           this.http.post(this.controllerAddress, {serviceId, businessId, employeeId, time}, {withCredentials: true}).subscribe({
            next: appointment => {
                resolve(true);
            },
            error: err => {
                console.error(err);
                resolve(false);
            }
           })
        });
    }

    private BuildQueryDate(date : Date) {
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
}