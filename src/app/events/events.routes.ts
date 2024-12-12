import { Routes } from "@angular/router";
import { leavePageGuard } from "../shared/guards/leave-page.guard";
import { numericIdGuard } from "../shared/guards/numeric-id.guard";
import { eventResolver } from "../shared/resolvers/event.resolver";

export const eventsRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
          import('./events-page/events-page.component')
          .then((m) => m.EventsPageComponent),
        title: 'Events | Angular Events',
    },
    {
        path: 'add',
        canDeactivate: [leavePageGuard],
        loadComponent: () =>
          import('./event-form/event-form.component')
          .then((m) => m.EventFormComponent),
        title: 'New Event | Angular Events',
    },
    {
        path: ':id',
        canActivate: [numericIdGuard],
        resolve: {
          event: eventResolver,
        },
        loadComponent: () =>
          import('./event-detail/event-detail.component')
          .then((m) => m.EventDetailComponent),

        title: 'Detail Events | Angular Events',
      },
]