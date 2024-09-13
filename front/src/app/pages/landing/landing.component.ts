import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SessionService } from '../../auth/services/session.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [ ButtonModule ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent
{
    constructor(private router: Router, private sessionService: SessionService){}

    public onLoginButtonClicked() 
    {
        this.router.navigate(['/login']);
    }

    public onRegisterButtonClicked() 
    {
        this.router.navigate(['/register']);
    }
}
