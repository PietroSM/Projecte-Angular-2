import { Routes } from "@angular/router";
import { leavePageGuard } from "../shared/guards/leave-page.guard";
import { numericIdGuard } from "../shared/guards/numeric-id.guard";
import { eventResolver } from "../shared/resolvers/event.resolver";
import { loginActiveGuard } from "../shared/guards/login-active.guard";

export const eventsRoutes: Routes = [
    {
        path: '',
        canActivate: [loginActiveGuard],
        loadComponent: () =>
          import('./events-page/events-page.component')
          .then((m) => m.EventsPageComponent),
        title: 'Events | Angular Events',
    },
    {
        path: 'add',
        canActivate: [loginActiveGuard],
        canDeactivate: [leavePageGuard],
        loadComponent: () =>
          import('./event-form/event-form.component')
          .then((m) => m.EventFormComponent),
        title: 'New Event | Angular Events',
    },
    {
      path: ':id/edit',
      canActivate: [loginActiveGuard],
      canDeactivate: [leavePageGuard],
      resolve: {
        event: eventResolver,
      },
      loadComponent: () =>
        import('./event-form/event-form.component')
        .then((m) => m.EventFormComponent),
      title: 'Edit Event | Angular Events',
    },
    {
        path: ':id',
        canActivate: [numericIdGuard, loginActiveGuard],
        resolve: {
          event: eventResolver,
        },
        loadComponent: () =>
          import('./event-detail/event-detail.component')
          .then((m) => m.EventDetailComponent),

        title: 'Detail Events | Angular Events',
    }
]