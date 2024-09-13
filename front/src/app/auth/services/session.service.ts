import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SessionInformation } from '../interfaces/session-information.interface';
import { UserService } from '../../services/user.service';
import { User } from '../interfaces/user.interface';

@Injectable({
    providedIn: 'root'
})
export class SessionService 
{
    public isLogged: boolean = false;
    public sessionInfo: SessionInformation | undefined = undefined;

    private isLoggedSubject = new BehaviorSubject<boolean>(this.isLogged);

    constructor(private userService: UserService) {}

    // Used to listen to the logged state
    public $isLogged(): Observable<boolean> {
        return this.isLoggedSubject.asObservable();
    }

    public logIn(response: SessionInformation): void 
    {
        if (response.token.length === 0 ||
            response.user === null)
            return;
        
        this.sessionInfo = response;
        this.isLogged = true;

        localStorage.setItem('SESSION', JSON.stringify(response));

        this.propagate();
    }

    public logOut(): void 
    {
        this.sessionInfo = undefined;
        this.isLogged = false;

        localStorage.removeItem('SESSION');

        this.propagate();
    }

    public refreshUserInfo(user: User)
    {
        if (this.isLogged == false)
            return;
        this.sessionInfo!.user = user;
        localStorage.setItem('SESSION', JSON.stringify(this.sessionInfo));
    }

    // Used to send new state to listeners
    private propagate(): void {
        this.isLoggedSubject.next(this.isLogged);
    }
}
