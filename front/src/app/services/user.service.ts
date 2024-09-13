import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../auth/interfaces/user.interface';
import { ProfileUpdateRequest } from '../interfaces/profile-update-request';

@Injectable({
  providedIn: 'root'
})
export class UserService 
{
    private servicePath: String = 'users';

    constructor(private httpClient: HttpClient) { }

    public getById(id: number): Observable<User> {
        return this.httpClient.get<User>(`${this.servicePath}/${id}`);
    }

    public subscribe(userId: number, subjectId: number): Observable<any> {
        return this.httpClient.put<any>(`${this.servicePath}/${userId}/subscribe/${subjectId}`, null);
    }

    public unsubscribe(userId: number, subjectId: number): Observable<any> {
        return this.httpClient.put<any>(`${this.servicePath}/${userId}/unsubscribe/${subjectId}`, null);
    }

    public update(id: number, request: ProfileUpdateRequest): Observable<User> {
        return this.httpClient.put<User>(`${this.servicePath}/${id}`, request);
    }
}
