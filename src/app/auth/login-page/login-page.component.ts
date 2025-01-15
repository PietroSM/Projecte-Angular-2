import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormsModule,
  ReactiveFormsModule,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { from } from 'rxjs';
import { UserFacebookLogin, UserGoogleLogin, UserLogin } from '../../interfaces/user';
import { AuthService } from '../../services/auth.service';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { MyGeolocation } from '../my-geolocation';
import { GoogleLoginDirective } from '../../google-login/google-login.directive';
import { FbLoginDirective } from '../../facebook-login/fb-login.directive';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorModalComponent } from '../../shared/modals/error-modal/error-modal.component';

@Component({
  selector: 'app-login-page',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ValidationClassesDirective,
    GoogleLoginDirective,
    FbLoginDirective,
    RouterLink
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  #authService = inject(AuthService);
  #router = inject(Router);

  #fb = inject(NonNullableFormBuilder);

  newLogin = this.#fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  localitzacio = toSignal(from(MyGeolocation.getLocation()));


  #modalService = inject(NgbModal);

  iniciar() {
    const newLogin: UserLogin = {
      email: this.newLogin.getRawValue().email,
      password: this.newLogin.getRawValue().password,
      lat: this.localitzacio()?.latitude ?? 0,
      lng: this.localitzacio()?.longitude ?? 0,
    };

    this.#authService.login(newLogin).subscribe({
      next: () => this.#router.navigate(['/events']),
      error: (error) => {
        const modalRef = this.#modalService.open(ErrorModalComponent);
        modalRef.componentInstance.title = 'Error';
        modalRef.componentInstance.body = error.error.error;
      },
    });
  }

  loggedGoogle(resp: google.accounts.id.CredentialResponse) {
    const newlogin: UserGoogleLogin = {
      token: resp.credential,
      lat: this.localitzacio()?.latitude ?? 0,
      lng: this.localitzacio()?.longitude ?? 0,
    };

    this.#authService.loginGoogle(newlogin).subscribe({
      next: () => this.#router.navigate(['/events']),
      error: (error) => console.log(error.error),
    });
  }

  loggedFacebook(resp: fb.StatusResponse) {
    const newlogin: UserFacebookLogin = {
      token: resp.authResponse.accessToken!,
      lat: this.localitzacio()?.latitude ?? 0,
      lng: this.localitzacio()?.longitude ?? 0,
    };

    this.#authService.loginFacebook(newlogin).subscribe({
      next: () => this.#router.navigate(['/events']),
      error: (error) => console.log(error.error),
    });
  }

  showError(error: any) {
    console.error(error);
  }
}
