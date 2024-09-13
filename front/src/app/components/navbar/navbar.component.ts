import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { SessionService } from '../../auth/services/session.service';
import { AvatarModule } from 'primeng/avatar';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { PlatformService } from '../../services/platform.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ MenubarModule, AvatarModule, MenuModule ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy
{
    menuItems: MenuItem[] = [
        {
            icon: PrimeIcons.HOME,
            label: "Articles",
            routerLink: "/feed"
        },
        {
            icon: PrimeIcons.LIST_CHECK,
            label: "Thèmes",
            routerLink: "/subjects"
        }
    ]

    avatarMenuItems: MenuItem[] = [
        {
            icon: PrimeIcons.USER,
            label: "Profil",
            routerLink: "/profile"
        },
        {
            icon: PrimeIcons.SIGN_OUT,
            label: "Se déconnecter",
            command: e => { this.onLogoutClicked() },
        }
    ]

    private isMenuMobile: boolean = false;

    private resizeSubscription!: Subscription;

    constructor(
        public sessionService: SessionService,
        public platformService: PlatformService,
        private router: Router) {}

    ngOnInit(): void 
    {
        this.resizeSubscription = this.platformService.resizeSubject.subscribe(_ => this.onWindowResize());
    }

    ngOnDestroy(): void 
    {
        if (this.resizeSubscription)
            this.resizeSubscription.unsubscribe();
    }

    onLogoutClicked() {
        this.sessionService.logOut();
        this.router.navigate(['/landing']);
    }

    private onWindowResize() 
    {
        if (this.platformService.isTablet && 
            !this.isMenuMobile)
        {
            this.isMenuMobile = true;
            this.menuItems = [...this.menuItems, 
                { separator:true },
                {
                    icon: PrimeIcons.USER,
                    label: "Profil",
                    routerLink: "/profile"
                },
                {
                    icon: PrimeIcons.SIGN_OUT,
                    label: "Se déconnecter",
                    command: e => { this.onLogoutClicked() },
                }
            ];
        }
        
        if (!this.platformService.isTablet &&
            this.isMenuMobile)
        {
            this.isMenuMobile = false;
            this.menuItems = [...this.menuItems.slice(0, -3)];
        }
    }
}
