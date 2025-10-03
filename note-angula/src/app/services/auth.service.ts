import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface de resposta do backend
interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auths'; // base da sua API NestJS

  constructor(private http: HttpClient) {}

  // LOGIN
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password });
  }

  // CADASTRO
  create(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/creat`, { email, password });
  }

  // GUARDAR TOKENS
  setTokens(tokens: AuthResponse) {
    localStorage.setItem('accessToken', tokens.accessToken);
    if (tokens.refreshToken) {
      localStorage.setItem('refreshToken', tokens.refreshToken);
    }
  }

  // PEGAR TOKEN
  getToken(): string | null {
    const token = localStorage.getItem('accessToken');
    return token && token !== 'undefined' ? token : null;
  }

  // PEGAR REFRESH TOKEN
  getRefreshToken(): string | null {
    const refreshToken = localStorage.getItem('refreshToken');
    return refreshToken && refreshToken !== 'undefined' ? refreshToken : null;
  }

  // LOGOUT
  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  // MÉTODO PARA GUARD
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token; // retorna true se existir token
  }
}

