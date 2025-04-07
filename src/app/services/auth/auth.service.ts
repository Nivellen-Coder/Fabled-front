import { Injectable } from '@angular/core';
import { Observable, tap} from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiURL = 'http://localhost:8000/api/login_check';
  constructor(private http: HttpClient) {
  }

  login(username: string, password: string ): Observable<any> {
    return this.http.post<any>(this.apiURL, { username, password }).pipe(
      tap(response => {
          localStorage.setItem('jwt', response.token);  // Stocke le token
          localStorage.setItem('userId', response.id);
          localStorage.setItem('loggedInUsername', response.username);
      })
    );
  }

  get isLogged(): boolean {
    return localStorage.getItem('jwt') != null;
  }

  get loggedInUsername(): string|null {
    return localStorage.getItem('loggedInUsername');
  }

  get loggedInUserId(): string|null {
    return localStorage.getItem('userId');
  }

  logout(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('loggedInUsername');
    localStorage.removeItem('jwt');
  }
}
