import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

//class for authentication of users from db, login method returns true if user exists
export class AuthService {

  private loginUrl = 'https://localhost:8443';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    const body = {
      username: username,
      password: password
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.loginUrl}/login`, body, { headers: headers });
  }

  logout(username: string): Observable<any> {
    return this.http.post<any>(`${this.loginUrl}/logout`, { username });
  }

  getLoggedInUsers(): Observable<string[]> {
    return this.http.get<string[]>(`${this.loginUrl}/logged-in-users`);
  }
}
