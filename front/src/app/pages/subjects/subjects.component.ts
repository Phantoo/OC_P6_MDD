import { Component, OnDestroy, OnInit } from '@angular/core';
import { SubjectService } from '../../services/subject.service';
import { Subject } from '../../interfaces/subject.interface';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { SessionService } from '../../auth/services/session.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [ CardModule, ButtonModule, TooltipModule ],
  templateUrl: './subjects.component.html',
  styleUrl: './subjects.component.scss'
})
export class SubjectsComponent implements OnInit, OnDestroy
{
    userId!: number;
    subjects?: Subject[];
    userSubjects?: Subject[];

    subjectsSubscription?: Subscription;

    constructor(
        private subjectService: SubjectService,
        private userService: UserService,
        private sessionService: SessionService,
        private messageService: MessageService,
        private router: Router
    ) {}

    ngOnInit(): void
    {
        this.userId = this.sessionService.sessionInfo!.user.id;
        this.userSubjects = this.sessionService.sessionInfo!.user.subjects;
        this.subjectsSubscription = this.subjectService.getAll().subscribe({
            next: subjects => {
                this.subjects = subjects;
            },
            error: _ => {
                this.messageService.add({severity: 'error', summary:  'Erreur', detail: 'Impossible de charger les thèmes, veuillez réessayer plus tard' });
            }
        });
    }

    ngOnDestroy(): void 
    {
        this.subjectsSubscription?.unsubscribe();
    }

    isSubscribedTo(subject: Subject) : boolean 
    {
        return this.userSubjects?.find(s => s.id == subject.id) != null;
    }

    onSubjectClicked(subject: Subject): void
    {
        if (this.isSubscribedTo(subject))
        {
            this.userService.unsubscribe(this.userId, subject.id).subscribe({
                next: _ => this.onResponseReceived(),
                error: _ => this.messageService.add({severity: 'error', summary:  'Erreur', detail: "Impossible de s'abonner au thème, veuillez réessayer plus tard" })
            });
        }
        else 
        {
            this.userService.subscribe(this.userId, subject.id).subscribe({
                next: _ => this.onResponseReceived(),
                error: _ => this.messageService.add({severity: 'error', summary:  'Erreur', detail: "Impossible de se désabonner du thème, veuillez réessayer plus tard" })
            });
        }
    }

    onResponseReceived(): void
    {
        // Fetch user so we can refresh session informations and then reload page to display changes
        this.userService.getById(this.userId).pipe(take(1)).subscribe(user => {
            this.sessionService.refreshUserInfo(user);
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                this.router.navigate(['/subjects']);
            });
        });
    }
}
