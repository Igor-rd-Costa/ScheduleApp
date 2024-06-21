import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { App } from "../App.component";


export type Notification = {
    id: number,
    ownerId: string,
    heading: string,
    message: string,
    wasVisualized: boolean,
    time: Date
}

@Injectable()
export class NotificationsService {
    private controllerAddress = App.backendAddress+'notifications/';
    public constructor(private http: HttpClient) {}

    async GetUserNotifications() : Promise<Notification[]> {
        return new Promise<Notification[]>(resolve => {
            
            this.http.get<Notification[]>(this.controllerAddress+'user', {withCredentials: true}).subscribe({
                next: notifications => {
                    resolve(notifications);
                },
                error: err => {
                    console.error(err);
                    resolve([]);
                }
            });
        });
    }

    async MarkUserNotificationsAsRead() : Promise<void> {
        return new Promise<void>(resolve => {
            this.http.patch(this.controllerAddress+'user', {}, {withCredentials: true}).subscribe({
                next: () => {
                    resolve();
                },
                error: err => {
                    console.error(err);
                    resolve();
                }
            });
        });
    }

    async DeleteUserNotification(id : number) {
        return new Promise<boolean>(resolve => {
            this.http.delete(this.controllerAddress+'user', {body: id, withCredentials: true}).subscribe({
                next: () => {
                    resolve(true);
                },
                error: err => {
                    console.error(err);
                    resolve(false);
                }
            });
        });
    }

    async GetBusinessNotifications() : Promise<Notification[]> {
        return new Promise<Notification[]>(resolve => {
            this.http.get<Notification[]>(this.controllerAddress+'business', {withCredentials: true}).subscribe({
                next: notifications => {
                    resolve(notifications);
                },
                error: err => {
                    console.error(err);
                    resolve([]);
                }
            });
        });
    }

    async MarkBusinessNotificationsAsRead() : Promise<void> {
        return new Promise<void>(resolve => {
            this.http.patch(this.controllerAddress+'business', {}, {withCredentials: true}).subscribe({
                next: () => {
                    resolve();
                },
                error: err => {
                    console.error(err);
                    resolve();
                }
            });
        });
    }

    async DeleteBusinessNotification(id: number): Promise<boolean> {
    return new Promise<boolean>(resolve => {
        this.http.delete(this.controllerAddress+'business', {body: id, withCredentials: true}).subscribe({
            next: () => {
                resolve(true);
            },
            error: err => {
                console.error(err);
                resolve(false);
            }
        });
    });
    }
}