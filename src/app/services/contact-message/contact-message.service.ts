import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactMessageService {
  private apiUrl = 'https://fabled-project.onrender.com/api/admin'; // L'URL de ton API Symfony

  constructor(private http: HttpClient) {}

  getMessages(): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>(this.apiUrl + '/contacts');
  }
}
