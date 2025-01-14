import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { User, UserLogin } from '../interfaces/user';
import { catchError, map, Observable, of } from 'rxjs';
import { SingleUserResponse, TokenResponse } from '../interfaces/responses';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #eventsURL = 'auth';
  #logged = signal(false);
  #http = inject(HttpClient);

  //TODO
  getLogged(): WritableSignal<boolean> {
    return this.#logged;
  }

  register(user: User): Observable<User> {
    return this.#http
      .post<SingleUserResponse>(`${this.#eventsURL}/register`, user)
      .pipe(map((resp) => resp.user));
  }

  login(data: UserLogin): Observable<void> {
    return this.#http
      .post<TokenResponse>(`${this.#eventsURL}/login`, data)
      .pipe(
        map((resp) => {
          localStorage.setItem('token', resp.accessToken);
          this.#logged.set(!this.#logged());
        })
      );
  }

  logout(): void {
    this.#logged.set(false);
    localStorage.clear();
  }


  isLogged(): Observable<boolean> {
    if (!localStorage.getItem('token') && !this.#logged()) {
      return of(false);

    } else if (!this.#logged() && localStorage.getItem('token')) {

      return this.#http
        .get<Observable<boolean>>(`${this.#eventsURL}/validate`)
        .pipe(
          map(() => {
              this.#logged.set(true);
              return true;
            }
          ),
          catchError(() => {
            localStorage.removeItem('token');
            this.#logged.set(false);
            return of(false);
          })
        );
    }
    return of(true);
  }
}


