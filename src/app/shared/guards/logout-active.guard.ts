import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { map } from 'rxjs';

export const logoutActiveGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.isLogged()
    .pipe(map(resp => {
      if(resp){
        return router.createUrlTree(['/events']);
      }else{
        return true;
      }
    }));

};
