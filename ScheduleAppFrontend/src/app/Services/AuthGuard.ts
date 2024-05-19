import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import AuthService from "./AuthService";

export const AuthGuard : CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

    const authService : AuthService = inject(AuthService);
    const router : Router = inject(Router);
    let rt = route.url[0]?.path ?? "";
    const isLogged = await authService.IsLogged();
    const pathRequiresAuth = !(rt === 'login' || rt === 'register' || rt === '');
    if (isLogged) {
        if (!pathRequiresAuth) {
            router.navigate(['dashboard']);
            return false;
        }
        return true;
    } else {
        if (pathRequiresAuth) {
            router.navigate(['login']);
            return false;
        }
        return true;
    }
};