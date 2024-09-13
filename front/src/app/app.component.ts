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

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, FormsModule, NavbarComponent, ToastModule ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    providers: [MessageService]
})
export class AppComponent implements OnInit
{
    title = 'MDDApp';

    constructor(
        private router: Router,
        private sessionService: SessionService,
        public platformService: PlatformService,
        @Inject(DOCUMENT) private document: Document
        ) {}

    ngOnInit(): void 
    {
        const localStorage = this.document.defaultView?.localStorage;
        if (!localStorage)
            return;

        // Get session informations
        const sessionString = localStorage.getItem('SESSION');
        if (sessionString === null)
            return;
        const sessioninfo: SessionInformation = JSON.parse(sessionString);

        // Get token expiration time
        const jwtToken = JSON.parse(atob(sessioninfo.token.split('.')[1]));
        const expirationDate = new Date(jwtToken.exp * 1000);
        if (expirationDate.getTime() < Date.now())
            localStorage.removeItem('SESSION');
        else
            this.sessionService.logIn(sessioninfo);

        // AFK Logout
        if (isPlatformBrowser(PLATFORM_ID))
        {
            const timeout = expirationDate.getTime() - Date.now();
            setTimeout(() => this.onTokenExpired, timeout);
        }
    }

    shouldShowNavBar(): boolean {
        return this.router.url !== '/landing';
    }

    onTokenExpired() {
        this.sessionService.logOut();
        this.router.navigate(['/landing']);
    }
}