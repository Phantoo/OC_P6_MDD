import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest } from '../interfaces/login-request.interface';
import { AuthResponse } from '../interfaces/auth-response.interface';

@Injectable({
    providedIn: 'root'
})
export class AuthService 
{
    private servicePath: String = 'auth';

    constructor(private httpClient: HttpClient) { }

    public login(request: LoginRequest): Observable<AuthResponse> {
        return this.httpClient.post<AuthResponse>(`${this.servicePath}/login`, request);
    }
}
