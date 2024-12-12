import { Routes } from "@angular/router";

export const authRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./login-page/login-page.component')
            .then((m) => m.LoginPageComponent),
        title: 'Login | Angular Events'
    }
]