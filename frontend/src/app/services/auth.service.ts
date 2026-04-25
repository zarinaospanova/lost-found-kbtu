import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../interfaces/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/auth';
  currentUser = signal<any | null>(this.getUserFromStorage());

  constructor(private http: HttpClient) {}

  register(data: { username: string; email: string; password: string; password2: string }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register/`, data)
      .pipe(tap((res) => this.saveAuth(res)));
  }

  login(data: { username: string; password: string }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login/`, data)
      .pipe(tap((res) => this.saveAuth(res)));
  }

  logout(): void {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access');
  }

  private saveAuth(res: AuthResponse): void {
    localStorage.setItem('access', res.tokens.access);
    localStorage.setItem('refresh', res.tokens.refresh);
    localStorage.setItem('user', JSON.stringify(res.user));
    this.currentUser.set(res.user);
  }

  private getUserFromStorage(): any | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
