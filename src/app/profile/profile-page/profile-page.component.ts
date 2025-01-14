import { Component, effect, inject, input, signal } from '@angular/core';
import { User, UserPasswordEdit, UserPhotoEdit, UserProfileEdit } from '../../interfaces/user';
import { NgClass } from '@angular/common';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { equalValues } from '../../shared/validator/equals-values.validators';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { Router, RouterLink } from '@angular/router';
import { OlMapDirective } from '../../shared/directives/ol-maps/ol-map.directive';
import { OlMarkerDirective } from '../../shared/directives/ol-maps/ol-marker.directive';

@Component({
  selector: 'app-profile-page',
  imports: [NgClass, FormsModule,OlMapDirective,OlMarkerDirective, ReactiveFormsModule, EncodeBase64Directive, RouterLink],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent {
  user = input.required<User>();
  #userService = inject(UsersService);

  showProfileInfo = signal(true);
  showEditProfile = signal(false);
  showEditPassword = signal(false);
  image = signal<string>('');
  coordinates = signal<[number, number]>([0, 0]);

  #fb = inject(NonNullableFormBuilder);
  newEdit = this.#fb.group({
    email: '',
    name: ''
  });


  newPassword = this.#fb.group({
    password: '',
    password2: ''
  },
  {
    validators: equalValues('password', 'password2')
  });

  constructor(){
    effect(() => {
      this.newEdit.get('email')?.setValue(this.user().email);
      this.newEdit.get('name')?.setValue(this.user().name);
      this.image.set(this.user().avatar);

      this.coordinates.set([this.user().lat, this.user().lng]);
    });
  }

  editProfile(){
    this.showProfileInfo.set(!this.showProfileInfo());
    this.showEditProfile.set(!this.showEditProfile());
  }

  editNameEmail(){
    const userEdit : UserProfileEdit = {
      name: this.newEdit.getRawValue().name,
      email: this.newEdit.getRawValue().email
    };

    this.#userService
      .saveProfile(userEdit)
      .subscribe({
        next: () => {
          this.user().email = userEdit.email;
          this.user().name = userEdit.name;
          this.editProfile();
        },
        error: (error) => console.log(error)
      });
  }

  editProfile2(){
    this.showProfileInfo.set(!this.showProfileInfo());
    this.showEditPassword.set(!this.showEditPassword());
  }


  editPassword(){
    const pass : UserPasswordEdit = {
      password: this.newPassword.getRawValue().password
    }

    this.#userService
      .savePassword(pass)
      .subscribe({
          next: () => this.editProfile2(),
          error: (error) => console.log(error)
      });
  }

  
  editPhoto(avatar: string){
    const send : UserPhotoEdit = {
      avatar: avatar
    }


    this.#userService
      .saveAvatar(send)
      .subscribe({
        next: () => this.image.set(avatar),
        error: (error) => console.log(error)
      })
  }

}
