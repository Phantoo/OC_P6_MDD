import { Component, OnInit } from '@angular/core';
import { SubjectService } from '../../services/subject.service';
import { Subject } from '../../interfaces/subject.interface';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { SessionService } from '../../auth/services/session.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { User } from '../../auth/interfaces/user.interface';

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [ CardModule, ButtonModule, TooltipModule ],
  templateUrl: './subjects.component.html',
  styleUrl: './subjects.component.scss'
})
export class SubjectsComponent implements OnInit
{
    userId!: number;
    subjects?: Subject[];
    userSubjects?: Subject[];

    constructor(
        private subjectService: SubjectService,
        private userService: UserService,
        private sessionService: SessionService,
        private router: Router
    ) {}

    ngOnInit() 
    {
        if (this.sessionService.sessionInfo == undefined)
        {
            this.router.navigate(['/landing']);
            return;
        }
        this.userId = this.sessionService.sessionInfo.user.id;
        this.userSubjects = this.sessionService.sessionInfo.user.subjects;
        this.subjectService.getAll().subscribe(subjects => {
            this.subjects = subjects;
        })
    }

    isSubscribedTo(subject: Subject) : boolean {
        return this.userSubjects?.find(s => s.id == subject.id) != null;
    }

    onSubjectClicked(subject: Subject)
    {
        if (this.isSubscribedTo(subject))
            this.userService.unsubscribe(this.userId, subject.id).subscribe(_ => this.onResponseReceived());
        else
            this.userService.subscribe(this.userId, subject.id).subscribe(_ => this.onResponseReceived());
    }

    onResponseReceived() 
    {
        // Fetch user so we can refresh session informations and then reload page to display changes
        this.userService.getById(this.userId).subscribe(user => {
            this.sessionService.refreshUserInfo(user);
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                this.router.navigate(['/subjects']);
            });
        });
    }
}
