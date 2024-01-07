import { Injectable } from '@angular/core';
import {map, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`http://127.0.0.1:8000/api/login_check`, { username, password })
      .pipe(
        map(response => {
          // login successful if there's a jwt token in the response
          if (response) {
            localStorage.setItem('jwt', JSON.stringify(response));
            localStorage.setItem('loggedInUsername', username);
          }
        })
      );
  }

  get isLogged(): boolean {
    return localStorage.getItem('jwt') != null;
  }

  get loggedInUsername(): string|null {
    return localStorage.getItem('loggedInUsername');
  }

  logout(): void {
    localStorage.removeItem('loggedInUsername');
    localStorage.removeItem('jwt');
  }
}
