
import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from '../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class HostessGuard implements CanActivate {
  private allowedRole = "HOSTESS";

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(): any {
    let myRole = null;

    this.authService.getRole().subscribe({
      next: (response: any) => {
        myRole = response.role;
      }, error: err => {
        console.log(err);
      }
    });

    if (myRole === this.allowedRole) {
      return true;
    } else {
      alert('You cannot access here')
      //return this.router.parseUrl('/unauthorized');
    }
  }
}
