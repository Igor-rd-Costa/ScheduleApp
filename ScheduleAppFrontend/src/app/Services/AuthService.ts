import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { App } from "../App.component";
import CacheService from "./CacheService";
import { Business } from "./BusinessService";

export type User = {
    id: string,
    firstName : string,
    lastName : string,
    email : string,
    lastEditDate : Date,
    hasUnseenNotifications : boolean
}

export type SessionData = {
    isLogged: boolean,
    user: User | null,
    business: Business | null
}


@Injectable()
export default class AuthService {
    private controllerAddress = App.backendAddress+"auth/";
    public loggedUser = signal<User|null>(null);
    public loggedBusiness = signal<Business|null>(null);
    public constructor(private http : HttpClient, private cache : CacheService) {
        this.loggedUser.set(this.cache.GetLoggedUser());
        this.loggedBusiness.set(this.cache.GetLoggedBusiness());
    }

    async Login(email : string, password : string) : Promise<boolean> {
        return new Promise<boolean>(resolve => {
            this.http.post<{ user: User, business : Business | null }>(this.controllerAddress+"login", {email, password}, {withCredentials: true}).subscribe({
                next: (info : { user: User, business : Business | null }) => {
                    this.loggedUser.set(info.user);
                    this.cache.SetLoggedUser(info.user);
                    this.loggedBusiness.set(info.business);
                    this.cache.SetLoggedBusiness(info.business);
                    resolve(true);
                },
                error: err => {
                    if (err.status !== 401) {
                        console.error(err);
                    }
                    this.loggedUser.set(null);
                    this.cache.SetLoggedUser(null);
                    this.loggedBusiness.set(null);
                    this.cache.SetLoggedBusiness(null);
                    resolve(false);
                }
            })
        })
    }

    IsLogged() : boolean {
        return this.loggedUser() !== null;
    }

    HasUnseenNotifications() : boolean {
        const u = this.UserHasUnseenNotifications();
        const b = this.BusinessHasUnseenNotifications();
        return u || b;
    }

    UserHasUnseenNotifications(): boolean {
        return this.loggedUser()?.hasUnseenNotifications ?? false;
    }

    BusinessHasUnseenNotifications(): boolean {
        return this.loggedBusiness()?.hasUnseenNotifications ?? false;
    }

    async Logout() : Promise<void> {
        return new Promise<void>(resolve => {
            this.http.post(this.controllerAddress+"logout", {}, {withCredentials: true}).subscribe({
                next: () => {
                    this.loggedUser.set(null);
                    this.cache.SetLoggedUser(null);
                    this.loggedBusiness.set(null);
                    this.cache.SetLoggedBusiness(null);
                    resolve();
                },
                error: err => {
                    if (err.status !== 400) {
                        console.error(err);
                    }
                    resolve();
                }
            })
        })
    }

    async Register(firstName : string, lastName : string, email : string, password : string) : Promise<boolean> {
        return new Promise<boolean>(resolve => {
            this.http.post<boolean>(this.controllerAddress+"register", {firstName, lastName, email, password}).subscribe({
                next: result => {
                    resolve(result);
                },
                error: err => {
                    console.error(err);
                    resolve(false);
                }
            })
        });
    }
    
    async IsEmailAvailable(email : string) : Promise<boolean> { 
        return new Promise<boolean>(resolve => {
            this.http.get<boolean>(this.controllerAddress+"is-email-available?email="+email).subscribe(
                {next: result => {
                    resolve(result)
                },
                error: err => {
                    console.error(err);
                    resolve(false);
                }
            }
            );
        });
    }

    async GetSessionData() {
        return new Promise<SessionData>(resolve => {
            const loggedUser = this.cache.GetLoggedUser();
            const loggedBusiness = this.cache.GetLoggedBusiness();
            const userData = loggedUser !== null ? loggedUser.lastEditDate : "";
            const businessData = loggedBusiness !== null ? loggedBusiness.lastEditDate : "";
            this.http.get<SessionData>(this.controllerAddress+`session?uData=${userData}&bData=${businessData}`, {withCredentials: true}).subscribe({
                next: sessionData => {
                    if (!sessionData.isLogged) {
                        this.cache.SetLoggedUser(null);
                        this.cache.SetLoggedBusiness(null);
                        this.loggedUser.set(null);
                        this.loggedBusiness.set(null);
                    } else {
                        if (sessionData.user !== null) {
                            this.cache.SetLoggedUser(sessionData.user)
                            this.loggedUser.set(sessionData.user)   
                        }
                        if (sessionData.business !== null) {
                            this.cache.SetLoggedBusiness(sessionData.business)
                            this.loggedBusiness.set(sessionData.business)
                        }
                    }
                    resolve(sessionData)
                },
                error: err => {
                    console.error(err);
                    const sessionData : SessionData = {
                        isLogged: false, 
                        user: null, 
                        business: null
                    };
                    this.cache.SetLoggedUser(sessionData.user)
                    this.cache.SetLoggedBusiness(sessionData.business)
                    this.loggedUser.set(sessionData.user);
                    this.loggedBusiness.set(sessionData.business);
                    resolve(sessionData);
                }
            });
        });
    }

    async GetUser(userUrl : string | null) : Promise<User|null> {
        return new Promise<User|null>(resolve => {
            this.http.get<User>(this.controllerAddress, {withCredentials: true}).subscribe({
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

    GetLoggedUser() {
        return this.loggedUser();
    }

    GetLoggedBusiness() {
        return this.loggedBusiness();
    }
}