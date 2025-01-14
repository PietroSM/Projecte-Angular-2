import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SingleUserResponse } from '../interfaces/responses';
import { User, UserPasswordEdit, UserPhotoEdit, UserProfileEdit } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  #usersURL = 'users';
  #http = inject(HttpClient);
  
  getProfile(id?: number): Observable<User> {
    return id === undefined?
      this.#http.get<SingleUserResponse>(`${this.#usersURL}/me`)
      .pipe(map((resp) => resp.user)) :
      this.#http.get<SingleUserResponse>(`${this.#usersURL}/${id}`)
      .pipe(map((resp) => resp.user));
  }

  saveProfile(user: UserProfileEdit): Observable<void> {
    return this.#http
      .put<void>(`${this.#usersURL}/me`, user);
  }

  savePassword(password: UserPasswordEdit): Observable<void> {
    return this.#http
      .put<void>(`${this.#usersURL}/me/password`, password);
  }

  saveAvatar(avatar: UserPhotoEdit): Observable<void> {
    return this.#http
      .put<void>(`${this.#usersURL}/me/photo`, avatar);
  }
  
}
