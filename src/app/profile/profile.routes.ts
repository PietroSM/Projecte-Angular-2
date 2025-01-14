import { Routes } from "@angular/router";
import { loginActiveGuard } from "../shared/guards/login-active.guard";
import { profileResolver } from "../shared/resolvers/profile.resolver";

export const userRoutes: Routes = [
    {
        path: 'me',
        canActivate: [loginActiveGuard],
        resolve: {
            user: profileResolver
        },
        loadComponent: () =>
            import('./profile-page/profile-page.component')
            .then((m) => m.ProfilePageComponent),
        title: 'Profile | Angular Events'
    },
    {
        path: ':id',
        canActivate: [loginActiveGuard],
        resolve: {
            user: profileResolver
        },
        loadComponent: () =>
            import('./profile-page/profile-page.component')
            .then((m) => m.ProfilePageComponent),
        title: 'Profile | Angular Events'
    }
]