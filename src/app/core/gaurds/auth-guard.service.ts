import { Injectable } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { OktaAuthStateService } from '@okta/okta-angular';
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    public authStateService: OktaAuthStateService,
    private _localStorageService : LocalStorageService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let isLoggedIn=this._localStorageService.get('UserData') as Boolean;
    let oktaToken = this._localStorageService.get('okta-token-storage') as Boolean;
    if(oktaToken) {
      this._localStorageService.remove('UserData');
      this.authStateService.authState$.subscribe((reponse) => {
        if (!reponse.isAuthenticated) this.router.navigateByUrl('/auth/home');
      });
      
    }
    else if (!isLoggedIn) {
      this.router.navigate(['/auth/home']);
      return false;
    } else {
      this._localStorageService.remove('okta-token-storage');
    }
    return true;
  }
}
