import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { App } from "../App.component";
import { DateTime, Hour, Time } from "../Utils/Time";
import BusinessService from "./BusinessService";
import { BusinessService as BusinessServiceData } from "./ServicesService";
import { ServicesService } from "./ServicesService";

export type Appointment = {
    id: number,
    businessId : string,
    clientId : string,
    employeeId : string,
    serviceId : number,
    time : number
}

export type AppointmentInfo = {
    id: number,
    businessName : string,
    employeeName : string, 
    serviceName : string,
    price : number | null,
    duration : number,
    time : number
  }

@Injectable()
export class ScheduleService {
    private controllerAddress = App.backendAddress+"schedule/";

    public constructor(private http : HttpClient, private businessService : BusinessService, private serviceService: ServicesService) {}

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

    async GetPastAppointments() {
        return new Promise<Appointment[]>(resolve => {
            this.http.get<Appointment[]>(this.controllerAddress+`past-appointments?cache=[]`, {withCredentials: true}).subscribe({
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

    async GetAppointmentInfo(appointments : Appointment[]) : Promise<AppointmentInfo[]> {
        if (appointments.length === 0)
          return [];
    
        let info : AppointmentInfo[] = [];
        for (let i = 0; i < appointments.length; i++) {
          const a = appointments[i];
    
          const business = await this.businessService.GetBusinessById(a.businessId);
          if (!business)
            continue;
          const service = await this.serviceService.GetService(a.serviceId, business.id);
          const employee = await this.businessService.GetBusinessEmployee(business.id, a.employeeId);
          if (!service || !employee)
            continue;
    
          info.push({
            id: a.id,
            businessName: business.name,
            employeeName: employee.firstName,
            serviceName: service.name,
            price: service.price,
            duration: service.duration,
            time: a.time
          });
        }
        
        return info;
      }

    async GetScheduleInfo(id : number, businessId : string) {
        return new Promise<BusinessServiceData|null>(resolve => {
            this.http.get<BusinessServiceData>(this.controllerAddress+`info?id=${id}&businessId=${businessId}&cache=[]`, {withCredentials: true}).subscribe({
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

    async Schedule(serviceId : number, businessId : string, employeeId : string, time : DateTime) {
        return new Promise<boolean>(resolve => {
           this.http.post<Appointment>(this.controllerAddress, {serviceId, businessId, employeeId, time}, {withCredentials: true}).subscribe({
            next: appointment => {
                console.log("Set to time", Time.DateTimeToString(appointment.time));
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