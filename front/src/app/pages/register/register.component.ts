import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield'
import { InputIconModule } from 'primeng/inputicon'
import { InputTextModule } from 'primeng/inputtext'
import { FloatLabelModule } from 'primeng/floatlabel'
import { PasswordModule } from 'primeng/password'
import { ButtonModule } from 'primeng/button'
import { RegisterRequest } from '../../auth/interfaces/register-request.interface';
import { AuthService } from '../../auth/services/auth.service';
import { SessionService } from '../../auth/services/session.service';
import { Router } from '@angular/router';
import { SessionInformation } from '../../auth/interfaces/session-information.interface';
import { MessageService } from 'primeng/api';
import { AutoFocusModule } from 'primeng/autofocus';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, InputTextModule, FloatLabelModule, IconFieldModule, InputIconModule, PasswordModule, ButtonModule, AutoFocusModule ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent 
{
    strongPasswordRegex: RegExp = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

    registerForm = new FormGroup({
        email: new FormControl('', { 
            validators: [ Validators.required, Validators.email ],
            nonNullable: true,
            initialValueIsDefault: true
        }),
        username: new FormControl('', { 
            validators: [ Validators.required, Validators.minLength(3) ],
            nonNullable: true,
            initialValueIsDefault: true
        }),
        password: new FormControl('', {
            validators: [ Validators.required, Validators.pattern(this.strongPasswordRegex) ],
            nonNullable: true,
            initialValueIsDefault: true
        })
    })

    constructor(
        private authService: AuthService, 
        private sessionService: SessionService,
        private router: Router,
        private messageService: MessageService,
        private location: Location
    ) {}

    onSubmit(): void 
    {
        let registerRequest : RegisterRequest = this.registerForm.getRawValue();
        this.authService.register(registerRequest).subscribe({
            next: response => this.onRegisterSuccess(response),
            error: _ => this.onRegisterFailure()
        })
    }

    onRegisterSuccess(response: SessionInformation) 
    {
        this.messageService.add({severity: 'success', summary:  'Création de compte réussie', detail: `Connecté en tant que ${response.user.username}` });

        // Enables the 'Bearer' header for requests
        this.sessionService.logIn(response);
        this.router.navigate(['/feed']);
    }

    onRegisterFailure() 
    {
        this.messageService.add({severity: 'error', summary:  'Création de compte échouée', detail: `L'email est peut-être déjà associée à un profil existant` });
    }

    onBackButtonClicked() {
        this.location.back();
    }
}
