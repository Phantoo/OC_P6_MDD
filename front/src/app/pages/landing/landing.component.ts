import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [ ButtonModule ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent
{
    constructor(private router: Router){}

    public onLoginButtonClicked(): void
    {
        this.router.navigate(['/login']);
    }

    public onRegisterButtonClicked(): void
    {
        this.router.navigate(['/register']);
    }
}
