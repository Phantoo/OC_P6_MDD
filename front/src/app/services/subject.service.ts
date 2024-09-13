import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from '../interfaces/subject.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectService 
{
    private servicePath: String = 'subjects';

    constructor(private httpClient: HttpClient) { }

    public getAll(): Observable<Subject[]> {
        return this.httpClient.get<Subject[]>(`${this.servicePath}`);
    }

    public getById(id: number): Observable<Subject> {
        return this.httpClient.get<Subject>(`${this.servicePath}/${id}`);
    }
}
