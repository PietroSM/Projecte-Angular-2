import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { User, UserLogin } from '../interfaces/user';
import { catchError, map, Observable, of } from 'rxjs';
import { SingleUserResponse, TokenResponse } from '../interfaces/responses';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  #eventsURL = 'auth';
  #logged = signal(false);
  #http = inject(HttpClient);

  //TODO
  getLogged():WritableSignal<boolean>{
    return this.#logged;
  }



  register(user: User): Observable<User>{
    return this.#http.post<SingleUserResponse>(`${this.#eventsURL}/register`, user)
            .pipe(map((resp) => resp.user));
  }



  login(data: UserLogin): Observable<void>{
    return this.#http.post<TokenResponse>(`${this.#eventsURL}/login`, data)
        .pipe(map((resp) => {
          localStorage.setItem('token', resp.accessToken);
          this.#logged.set(!this.#logged());
        }
      ));
  }


  logout(): void{
    localStorage.clear();
    this.#logged.set(false);
  }
  

  isLogged(): Observable<boolean>{

    if(localStorage.getItem('token') === undefined &&
    !this.#logged()){
      return of(false);

    } else if(this.#logged()){
      return of(true);

    } else if(localStorage.getItem('token')){
      return this.#http.get<{ valid: boolean }>(`${this.#eventsURL}/validate`)
        .pipe(map((resp) =>{
          if(resp.valid) {
            this.#logged.set(true);
            return true;
          }

          this.#logged.set(false);
          return false;
        }
      ),
      catchError(() => {
        localStorage.removeItem('token');
        this.#logged.set(false);
        return of(false);
      })
    );
    }
    return of(false);
  }


}
