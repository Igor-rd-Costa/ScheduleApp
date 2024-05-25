import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { App } from "../App.component";
import CacheService from "./CacheService";
import { Business } from "./BusinessService";

export type User = {
    id: number,
    firstName : string,
    lastName : string,
    email : string,
    lastEditDate : Date
}


@Injectable()
export default class AuthService {
    private authAddress = App.backendAddress+"auth/";
    public isLogged = false;
    public constructor(private http : HttpClient, private cache : CacheService) {}

    async Login(email : string, password : string) : Promise<boolean> {
        return new Promise<boolean>(resolve => {
            this.http.post<{ user: User, business : Business | null }>(this.authAddress+"login", {email, password}, {withCredentials: true}).subscribe({
                next: (info : { user: User, business : Business | null }) => {
                    this.cache.SetLoggedUser(info.user);
                    if (info.business)
                        this.cache.SetLoggedBusiness(info.business)
                    else
                        this.cache.DeleteLoggedBusiness();
                    resolve(true);
                },
                error: err => {
                    if (err.status !== 401) {
                        console.error("Login request error:", err);
                    }
                    resolve(false);
                }
            })
        })
    }

    async Logout() : Promise<void> {
        return new Promise<void>(resolve => {
            this.http.post(this.authAddress+"logout", {}, {withCredentials: true}).subscribe({
                next: () => {
                    this.cache.DeleteLoggedUser();
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
            this.http.post<boolean>(this.authAddress+"register", {firstName, lastName, email, password}).subscribe({
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
    
    async IsLogged() {
        return new Promise<boolean>((resolve) => {
            this.http.get<boolean>(this.authAddress+"is-logged", {withCredentials: true}).subscribe({
                next: result => {
                    this.isLogged = result;
                    resolve(result);
                },
                error: err => {
                    console.error(err);
                    this.isLogged = false;
                    resolve(false);
                }
            });
        });
    }

    async IsEmailAvailable(email : string) : Promise<boolean> { 
        return new Promise<boolean>(resolve => {
            this.http.get<boolean>(this.authAddress+"is-email-available?email="+email).subscribe(
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

    async GetUser(userUrl : string | null) : Promise<User> {
        return new Promise<User>(resolve => {
            this.http.get<User>(this.authAddress, {withCredentials: true}).subscribe({
                next: result => {
                    resolve(result);
                },
                error: err => {
                    console.error(err);
                    resolve({
                        id: -1,
                        firstName: "",
                        lastName: "",
                        email: "",
                        lastEditDate: new Date(0)
                    });
                }
            })
        })
    }
}