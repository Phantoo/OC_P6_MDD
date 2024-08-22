import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SessionService 
{
    public isLogged: boolean = false;
    public token: string | undefined;

    private isLoggedSubject = new BehaviorSubject<boolean>(this.isLogged);

    // Used to listen to the logged state
    public $isLogged(): Observable<boolean> {
        return this.isLoggedSubject.asObservable();
    }

    public logIn(token: string): void {
        this.token = token;
        this.isLogged = true;
        this.propagate();
    }

    public logOut(): void {
        this.token = undefined;
        this.isLogged = false;
        this.propagate();
    }

    // Used to send new state to listeners
    private propagate(): void {
        this.isLoggedSubject.next(this.isLogged);
    }
}
