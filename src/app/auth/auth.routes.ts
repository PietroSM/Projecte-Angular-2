import { Routes } from "@angular/router";
import { logoutActiveGuard } from "../shared/guards/logout-active.guard";
import { loginActiveGuard } from "../shared/guards/login-active.guard";
import { eventResolver } from "../shared/resolvers/event.resolver";
import { profileResolver } from "../shared/resolvers/profile.resolver";

export const authRoutes: Routes = [
    {
        path: 'login',
        canActivate: [logoutActiveGuard],
        loadComponent: () =>
            import('./login-page/login-page.component')
            .then((m) => m.LoginPageComponent),
        title: 'Login | Angular Events'
    },
    {
        path: 'register',
        canActivate: [logoutActiveGuard],
        loadComponent: () =>
            import('./register-page/register-page.component')
            .then((m) => m.RegisterPageComponent),
        title: 'Register | Angular Events'
    },
]