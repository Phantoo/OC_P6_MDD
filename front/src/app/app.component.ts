import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/services/auth.service';
import { LoginRequest } from './auth/interfaces/login-request.interface';
import { FormsModule } from '@angular/forms';
import { SessionService } from './auth/services/session.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, FormsModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    title = 'MDDApp';

    // email: string = '';
    // password: string = '';
    // requestResponse: string = 'undefined';

    constructor(/*private authService: AuthService, private sessionService: SessionService*/) {}

    // onSubmit(): void {
    //     let request: LoginRequest = {
    //         email: this.email,
    //         password: this.password
    //     }
    //     this.authService.login(request).subscribe(
    //         response => {
    //             this.requestResponse = JSON.stringify(response, null, '\t');
    //             // Enables the 'Bearer' header for requests
    //             this.sessionService.logIn(response);
    //     }, 
    //         error => {
    //             if (this.sessionService.isLogged) {
    //                 // Disables the 'Bearer' header for requests
    //                 this.sessionService.logOut();
    //                 this.requestResponse = 'undefined';
    //             }
    //     });
    // }
}