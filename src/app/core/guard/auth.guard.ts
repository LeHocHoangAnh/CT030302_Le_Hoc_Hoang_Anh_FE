import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { TokenStorageService } from 'src/app/data/service/token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private tokenStorageService: TokenStorageService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.tokenStorageService.getToken();
    const expectedRole:any[] = route.firstChild.children[0].data.expectRole;
    if (currentUser) {
      const userInfo: any = this.tokenStorageService.getUser();
      if (!expectedRole && !userInfo) {
        return true;
      }
      if(expectedRole.length == 0){
        return true;
      }
      let isValidRole = false;
      let rules = userInfo.roles;
      if (!expectedRole && userInfo) {
        if(rules.length > 0) {
          isValidRole = true;
        }
      } else {
        const screenRules = [expectedRole].flat();
        screenRules.forEach(accessRule => {
          if(rules.indexOf(accessRule) >= 0){
            isValidRole = true;
          }
        })
      }
      if (!isValidRole) {
        this.router.navigate(['not-found']);
      }
      return isValidRole;
    }

    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
