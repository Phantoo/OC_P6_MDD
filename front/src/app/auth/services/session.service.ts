import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SessionInformation } from '../interfaces/session-information.interface';
import { User } from '../interfaces/user.interface';
import { CookieService } from 'ngx-cookie';

@Injectable({
    providedIn: 'root'
})
export class SessionService 
{
    public isLogged: boolean = false;
    public sessionInfo: SessionInformation | undefined = undefined;

    private isLoggedSubject = new BehaviorSubject<boolean>(this.isLogged);

    constructor(private cookieService: CookieService) {}

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

        this.cookieService.putObject("SESSION", response);

        this.propagate();
    }

    public logOut(): void 
    {
        this.sessionInfo = undefined;
        this.isLogged = false;
        
        this.cookieService.remove("SESSION");

        this.propagate();
    }

    public refreshUserInfo(user: User): void
    {
        if (this.isLogged == false)
            return;
        this.sessionInfo!.user = user;
        
        this.cookieService.putObject("SESSION", this.sessionInfo!);
    }

    // Used to send new state to listeners
    private propagate(): void {
        this.isLoggedSubject.next(this.isLogged);
    }
}
