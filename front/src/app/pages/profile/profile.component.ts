import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../auth/interfaces/user.interface';
import { Router } from '@angular/router';
import { SessionService } from '../../auth/services/session.service';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule, Location } from '@angular/common';
import { PasswordModule } from 'primeng/password';
import { ProfileUpdateRequest } from '../../interfaces/profile-update-request';
import { UserService } from '../../services/user.service';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { Subject } from '../../interfaces/subject.interface';
import { Subscription, take } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ CommonModule, ButtonModule, FloatLabelModule, InputTextModule, PasswordModule, MessagesModule, ReactiveFormsModule, DividerModule, CardModule ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit, OnDestroy
{
    strongPasswordRegex: RegExp = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

    user!: User;

    profileUpdateForm = new FormGroup({
        username: new FormControl('', { 
            validators: Validators.required,
            nonNullable: true
        }),
        email: new FormControl('', { 
            validators: [ Validators.required, Validators.email ],
            nonNullable: true
        }),
        password: new FormControl('', {
            validators: [ Validators.pattern(this.strongPasswordRegex) ]
        })
    })

    usernameDirty: Boolean = false;
    emailDirty: Boolean = false;
    passwordDirty: Boolean = false;

    updateSubscription?: Subscription;
    subjectsSubscription?: Subscription;

    constructor(
        private router: Router,
        private sessionService: SessionService,
        private userService: UserService,
        private messageService: MessageService,
        private location: Location
    ) {}


    ngOnInit(): void
    {
        this.user = this.sessionService.sessionInfo!.user;
        this.profileUpdateForm.setValue({
            username: this.user.username,
            email: this.user.email,
            password: ''
        });
        this.onFormUpdated();
    }

    ngOnDestroy(): void 
    {
        this.updateSubscription?.unsubscribe();
        this.subjectsSubscription?.unsubscribe();
    }

    onBackButtonClicked(): void
    {
        this.location.back();
    }

    // Check both fields and mark them as pristine if their content is the same as the original value
    onFormUpdated(): void
    {
        const usernameControl = this.profileUpdateForm.controls['username'];
        const usernamePristine = this.user.username === usernameControl.value;
        if (usernamePristine)
            usernameControl.markAsPristine();
        this.usernameDirty = !usernamePristine;

        const emailControl = this.profileUpdateForm.controls['email'];
        const emailPristine = this.user.email === emailControl.value;
        if (emailPristine)
            emailControl.markAsPristine();
        this.emailDirty = !emailPristine;

        const passwordControl = this.profileUpdateForm.controls['password'];
        this.passwordDirty = passwordControl.value !== '';
    }

    onFormSubmitted(): void
    {
        const userId = this.sessionService.sessionInfo!.user.id;
        const updateRequest: ProfileUpdateRequest = this.profileUpdateForm.getRawValue();
        this.updateSubscription = this.userService.update(userId, updateRequest).subscribe({
            next: updatedUser => this.onUpdateSuccess(updatedUser),
            error: _ => this.onUpdateFailure()
        })
    }

    onUpdateSuccess(updatedUser: User): void
    {
        // Fetch user so we can refresh session informations and then reload page to display changes
        this.sessionService.refreshUserInfo(updatedUser);
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate(['/profile']);
        });
        this.messageService.add({severity: 'success', summary:  'Succès', detail: "Profil mis à jour avec succès"});
    }

    onUpdateFailure(): void 
    {
        this.messageService.add({severity: 'error', summary:  'Erreur', detail: `Echec de la mise à jour, veuillez vérifier que les champs sont corrects` });
    }

    onSubjectClicked(subject: Subject): void
    {
        const userId = this.sessionService.sessionInfo!.user.id;
        this.subjectsSubscription = this.userService.unsubscribe(userId, subject.id).subscribe({
            next: _ => 
            {
                // Fetch user so we can refresh session informations and then reload page to display changes
                this.userService.getById(userId).pipe(take(1)).subscribe(user => {
                    this.sessionService.refreshUserInfo(user);
                    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                        this.router.navigate(['/profile']);
                    });
                });
            },
            error: _ => {
                this.messageService.add({severity: 'error', summary:  'Erreur', detail: `Impossible de se désabonner, veuillez réessayer plus tard` });
            }
        });
    }   
}
