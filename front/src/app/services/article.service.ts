import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Article } from '../interfaces/article.interface';
import { Observable } from 'rxjs';
import { CommentCreationRequest } from '../interfaces/comment-creation-request.interface';
import { CommentCreationResponse } from '../interfaces/comment-creation-response.interface';
import { ArticleCreationRequest } from '../interfaces/article-creation-request.interface';
import { ArticleCreationResponse } from '../interfaces/article-creation-response.interface';
import { Subject } from '../interfaces/subject.interface';
import { Page } from '../interfaces/page.interface';

@Injectable({
    providedIn: 'root'
})
export class ArticleService 
{
    private servicePath: String = 'articles';

    constructor(private httpClient: HttpClient) { }

    public getAll(page: number = 0, size: number = 1, subjects: Subject[]): Observable<Page> 
    {
        const parsedSubjects = subjects.map(s => s.id);
        const params = new HttpParams({
            fromObject: { 'subjects': parsedSubjects }})
            .set("page", page)
            .set("size", size);
        return this.httpClient.get<Page>(`${this.servicePath}`, {
            params: params
        });
    }

    public getById(id: number): Observable<Article> {
        return this.httpClient.get<Article>(`${this.servicePath}/${id}`);
    }

    public add(request: ArticleCreationRequest): Observable<ArticleCreationResponse> {
        return this.httpClient.post<ArticleCreationResponse>(`${this.servicePath}`, request);
    }

    public comment(id: number, request: CommentCreationRequest): Observable<CommentCreationResponse> {
        return this.httpClient.post<CommentCreationResponse>(`${this.servicePath}/${id}/comment`, request);
    }
}
