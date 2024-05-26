import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import AuthService from "./AuthService";
import CacheService from "./CacheService";

export const AuthGuard : CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

    const authService : AuthService = inject(AuthService);
    const router : Router = inject(Router);
    const cache : CacheService = inject(CacheService);

    let rt = route.url[0]?.path ?? "";
    const isLogged = await authService.IsLogged();
    const isOtherUserBusinessPage = (rt === 'business' && route.children[0]);
    const pathRequiresAuth = !(rt === 'login' || rt === 'register' || rt === '');
    const hasOptionalAuth = rt === 'businesses' || isOtherUserBusinessPage;
    if (hasOptionalAuth)
        return true;
    if (isLogged) {
        if (!pathRequiresAuth) {
            router.navigate(['dashboard']);
            return false;
        }
        return true;
    } else {
        cache.DeleteLoggedUser();
        cache.DeleteLoggedBusiness();
        if (pathRequiresAuth) {
            router.navigate(['login']);
            return false;
        }
        return true;
    }
};