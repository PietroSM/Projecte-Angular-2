import { Component, effect, inject } from '@angular/core';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { equalValues } from '../../shared/validator/equals-values.validators';
import { User } from '../../interfaces/user';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { toSignal } from '@angular/core/rxjs-interop';
import { MyGeolocation } from '../my-geolocation';
import { from } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [FormsModule, ReactiveFormsModule, ValidationClassesDirective, EncodeBase64Directive],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPageComponent {
  #authService = inject(AuthService);
  #router = inject(Router);
  #saved = false;
  #fb = inject(NonNullableFormBuilder);

  newUser = this.#fb.group({
    name: ['', [Validators.required]],
    emailGroup: this.#fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        emailConfirm: ['', [Validators.required, Validators.email]],
      },
      {
        validators: equalValues('email', 'emailConfirm'),
      }
    ),
    password: ['', [Validators.required, Validators.minLength(4)]],
    image: ['', [Validators.required]],
    lat: [0],
    lng: [0]
  });



  imageBase64 = '';

  localitzacio = toSignal(from(MyGeolocation.getLocation()));



  constructor(){
    effect(() =>{
      this.newUser.get('lat')?.setValue(this.localitzacio()?.latitude ?? 0);
      this.newUser.get('lng')?.setValue(this.localitzacio()?.longitude ?? 0);
    });

  }

  
  addUser() {
    const newUser : User = {
      name: this.newUser.getRawValue().name,
      email: this.newUser.getRawValue().emailGroup.email,
      password: this.newUser.getRawValue().password,
      avatar: this.imageBase64,
      lat: this.newUser.getRawValue().lat,
      lng: this.newUser.getRawValue().lng
    }


    this.#authService.register(newUser)
      .subscribe(() => {
        this.#router.navigate(['/auth/login']);
        this.#saved = true;
      });
  }


  canDeactivate() {
    return this.newUser.pristine || this.#saved || confirm('¿Quieres abandonar la página?. Los cambios se perderán...');
  }
}
