import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class PermissionsService {
  canActivate(
    state: RouterStateSnapshot,
    authService: AuthService,
    router: Router,
  ): boolean {
    const user = authService.userValue;
    if (user) {
      return true;
    }

    void router.navigate(['/login'], {
      queryParams: { returnUrl: state.url },
    });

    return false;
  }
  canMatch(): boolean {
    return true;
  }
}

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  return inject(PermissionsService).canActivate(
    state,
    inject(AuthService),
    inject(Router),
  );
};
