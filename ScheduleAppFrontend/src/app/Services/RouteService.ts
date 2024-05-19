import { Injectable } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import AuthService from "./AuthService";




@Injectable()
export default class RouteService {
    private route = '/';

    public constructor(private router : Router) {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.route = event.url;
            }
        })
    }

    Route() {
        return this.route;
    }
}