import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { App } from "../App.component";

export type UserInfo = {
    firstName : string,
    lastName : string,
    email : string
}


@Injectable()
export default class AuthService {
    private authAddress = App.backendAddress+"auth/";
    public isLogged = false;
    public constructor(private http : HttpClient) {}

    async Login(email : string, password : string) : Promise<boolean> {
        return new Promise<boolean>(resolve => {
            this.http.post(this.authAddress+"login", {email, password}, {withCredentials: true}).subscribe({
                next: () => {
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

    async GetUserInfo() : Promise<UserInfo> {
        return new Promise<UserInfo>(resolve => {
            this.http.get<UserInfo>(this.authAddress+"user", {withCredentials: true}).subscribe({
                next: result => {
                    resolve(result);
                },
                error: err => {
                    console.error(err);
                    resolve({
                        firstName: "",
                        lastName: "",
                        email: ""
                    });
                }
            })
        })
    }
}