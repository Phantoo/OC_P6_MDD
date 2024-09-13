import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield'
import { InputIconModule } from 'primeng/inputicon'
import { InputTextModule } from 'primeng/inputtext'
import { FloatLabelModule } from 'primeng/floatlabel'
import { PasswordModule } from 'primeng/password'
import { ButtonModule } from 'primeng/button'
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../auth/services/auth.service';
import { SessionService } from '../../auth/services/session.service';
import { LoginRequest } from '../../auth/interfaces/login-request.interface';
import { SessionInformation } from '../../auth/interfaces/session-information.interface';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AutoFocusModule } from 'primeng/autofocus';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ ReactiveFormsModule, InputTextModule, FloatLabelModule, IconFieldModule, InputIconModule, PasswordModule, ButtonModule, ToastModule, AutoFocusModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit 
{
    loginForm = new FormGroup({
        email: new FormControl('', { 
            validators: [ Validators.required, Validators.email ],
            nonNullable: true,
            initialValueIsDefault: true
        }),
        password: new FormControl('', {
            validators: Validators.required,
            nonNullable: true,
            initialValueIsDefault: true
        })
    })

    constructor(
        private authService: AuthService, 
        private sessionService: SessionService,
        private messageService: MessageService,
        private router: Router,
        private location: Location
    ) {}

    ngOnInit(): void 
    {
        if (this.sessionService.isLogged)
            this.router.navigate(['/feed']);
    }

    onSubmit(): void 
    {
        let loginRequest: LoginRequest = this.loginForm.getRawValue();
        this.sessionService.logOut();
        this.authService.login(loginRequest).subscribe({
            next: response => this.onLoginSuccess(response),
            error: _ => this.onLoginFailure()
        })
    }

    onLoginSuccess(response: SessionInformation) 
    {
        // Enables the 'Bearer' header for requests
        this.sessionService.logIn(response);
        this.router.navigate(['/feed']);
        this.messageService.add({severity: 'success', summary:  'Connexion réussie', detail: `Connecté en tant que ${response.user.username}` });
    }

    onLoginFailure() 
    {
        this.messageService.add({severity: 'error', summary:  'Connexion échouée', detail: `Veuillez vérifier que les identifiants sont corrects` });
    }

    onBackButtonClicked() {
        this.location.back();
    }
}
