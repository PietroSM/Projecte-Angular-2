import { Component, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormsModule, ReactiveFormsModule, NonNullableFormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { from } from "rxjs";
import { UserLogin } from "../../interfaces/user";
import { AuthService } from "../../services/auth.service";
import { ValidationClassesDirective } from "../../shared/directives/validation-classes.directive";
import { MyGeolocation } from "../my-geolocation";


@Component({
    selector: 'app-login-page',
    imports: [FormsModule, ReactiveFormsModule, ValidationClassesDirective],
    templateUrl: './login-page.component.html',
    styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
    #authService = inject(AuthService);
    #router = inject(Router);
    
    #fb = inject(NonNullableFormBuilder);

    newLogin = this.#fb.group({
        email: ['', [Validators.required]],
        password: ['', [Validators.required]]
    });


    localitzacio = toSignal(from(MyGeolocation.getLocation()));



    iniciar(){
        const newLogin : UserLogin = {
            email: this.newLogin.getRawValue().email,
            password: this.newLogin.getRawValue().password,
            lat: this.localitzacio()?.latitude ?? 0,
            lng: this.localitzacio()?.longitude ?? 0
        }


        this.#authService.login(newLogin)
            .subscribe({
                next: () => this.#router.navigate(['/events']),
                error: (error) => console.log(error.error)
            })

    }
}
