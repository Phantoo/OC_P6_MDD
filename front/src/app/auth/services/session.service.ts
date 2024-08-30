import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SessionInformation } from '../interfaces/session-information.interface';

@Injectable({
    providedIn: 'root'
})
export class SessionService 
{
    public isLogged: boolean = false;
    public sessionInfo: SessionInformation | undefined = undefined;

    private isLoggedSubject = new BehaviorSubject<boolean>(this.isLogged);

    // Used to listen to the logged state
    public $isLogged(): Observable<boolean> {
        return this.isLoggedSubject.asObservable();
    }

    public logIn(response: SessionInformation): void 
    {
        if (response.token.length === 0 ||
            response.user === null)
            return;
        
        this.sessionInfo = {
            user: response.user,
            token: response.token
        };
        this.isLogged = true;
        this.propagate();
    }

    public logOut(): void 
    {
        this.sessionInfo = undefined;
        this.isLogged = false;
        this.propagate();
    }

    // Used to send new state to listeners
    private propagate(): void {
        this.isLoggedSubject.next(this.isLogged);
    }
}
