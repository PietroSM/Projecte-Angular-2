import { ResolveFn, Router } from '@angular/router';
import { User } from '../../interfaces/user';
import { inject } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { catchError, EMPTY } from 'rxjs';

export const profileResolver: ResolveFn<User> = (route) => {
  const userService = inject(UsersService);
  const router = inject(Router);

  if(+route.params['id']){
    return userService.getProfile(+route.params['id'])
      .pipe(
        catchError(() => {
          router.navigate(['/events']);
          return EMPTY;
        })
      );
  } else {
    return userService.getProfile()
      .pipe(
        catchError(() => {
          router.navigate(['/events']);
          return EMPTY;
        })
      );
  }

};
