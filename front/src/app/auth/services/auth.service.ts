import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest } from '../interfaces/login-request.interface';
import { SessionInformation } from '../interfaces/session-information.interface';

@Injectable({
    providedIn: 'root'
})
export class AuthService 
{
    private servicePath: String = 'auth';

    constructor(private httpClient: HttpClient) { }

    public login(request: LoginRequest): Observable<SessionInformation> {
        return this.httpClient.post<SessionInformation>(`${this.servicePath}/login`, request);
    }
}
