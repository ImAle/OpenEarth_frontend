import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from '../core/services/auth.service';
import {catchError, map, of} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  private allowedRole = "ADMIN";

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(): any {
    return this.authService.getRole().pipe(
      map((response: any) => {
        return response.role === this.allowedRole
          ? true
          : this.router.parseUrl('/error/403');
      }),
      catchError(() => of(this.router.parseUrl('/error/403')))
    );
  }
}
