import { ResolveFn, Router } from '@angular/router';
import { EventsService } from '../../services/events.service';
import { inject } from '@angular/core';
import { MyEvent } from '../../interfaces/my-event';
import { catchError, EMPTY } from 'rxjs';

export const eventResolver: ResolveFn<MyEvent> = (route) => {
  const eventsService = inject(EventsService);
  const router = inject(Router);

  return eventsService.getEvent(+route.params['id']).pipe(
    catchError(() => {
      router.navigate(['/events']);
      return EMPTY;
    })
  );
};
