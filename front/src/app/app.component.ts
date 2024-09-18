import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SessionInformation } from './auth/interfaces/session-information.interface';
import { SessionService } from './auth/services/session.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { PlatformService } from './services/platform.service';
import { CookieModule, CookieService } from 'ngx-cookie';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, FormsModule, NavbarComponent, ToastModule, CookieModule ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    providers: [MessageService, CookieService]
})
export class AppComponent implements OnInit
{
    title = 'MDDApp';

    constructor(
        private router: Router,
        private sessionService: SessionService,
        public platformService: PlatformService,
        @Inject(DOCUMENT) private document: Document,
        private cookieService: CookieService
        ) {}

    ngOnInit(): void 
    {
        const sessionInfo: SessionInformation = this.cookieService.getObject('SESSION') as SessionInformation;
        if (sessionInfo == undefined)
            return;

        // Get token expiration time
        const jwtToken = JSON.parse(atob(sessionInfo.token.split('.')[1]));
        const expirationDate = new Date(jwtToken.exp * 1000);
        if (expirationDate.getTime() < Date.now())
            this.cookieService.remove('SESSION');
        else
            this.sessionService.logIn(sessionInfo);
    }

    shouldShowNavBar(): boolean {
        return this.router.url !== '/landing';
    }

    onTokenExpired(): void {
        this.sessionService.logOut();
        this.router.navigate(['/landing']);
    }
}