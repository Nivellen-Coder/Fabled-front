import { Injectable } from '@angular/core';
import { Observable, tap} from "rxjs";
import { HttpClient } from "@angular/common/http";
import {UserAuthModel} from "../../models/user/userAuthModel";
import {jwtDecode} from "jwt-decode";

interface UserPayload {
  id: string;
  email: string;
  roles: string[];
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiURL = 'https://fabled-project.onrender.com/api/login_check';
  constructor(private http: HttpClient) {
  }

  login(username: string, password: string ): Observable<any> {
    return this.http.post<any>(this.apiURL, { username, password }).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('jwt', response.token);  // Stocke le token
          localStorage.setItem('userId', response.id);
          localStorage.setItem('loggedInUsername', response.username);
        } else {
          return response;
        }
      })
    );
  }

  getCurrentUser(): UserPayload | null {
    const token = localStorage.getItem('jwt');
    if (!token) {
      return null;
    }

    try {
      const decoded = jwtDecode<UserPayload>(token);
      return decoded;
    } catch (error) {
      console.error('Token decoding failed:', error);
      return null;
    }
  }

  get isLogged(): boolean {
    return localStorage.getItem('jwt') != null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwt');
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
