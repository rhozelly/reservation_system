import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MainService } from '../services/main.service';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminGuard implements CanActivate {
  user: any;

  constructor(private router: Router,
    private main: MainService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const url: string = state.url;
    return this.isLoggedIn(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(route, state);
  }

  isLoggedIn(url: string): boolean {
    if (this.main.getSessionTokens()) {
      const session_data_decrypted = this.main.decrypt(localStorage.getItem('sessions'),this.main.tokenKeys().session_data);
      const session_data_parsed = JSON.parse(session_data_decrypted);
      const priv = session_data_parsed.priv_label;
        if(priv === 'super-admin'){
          return true;
        }
    }
    this.router.navigate(['/login']);
    return false;
  }

}
