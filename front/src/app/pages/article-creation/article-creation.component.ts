import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { Subject } from '../../interfaces/subject.interface';
import { ArticleCreationRequest } from '../../interfaces/article-creation-request.interface';
import { SubjectService } from '../../services/subject.service';
import { Router } from '@angular/router';
import { SessionService } from '../../auth/services/session.service';
import { ArticleService } from '../../services/article.service';
import { MessageService } from 'primeng/api';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-article-creation',
  standalone: true,
  imports: [ ButtonModule, FloatLabelModule, ReactiveFormsModule, InputTextareaModule, InputTextModule, DropdownModule ],
  templateUrl: './article-creation.component.html',
  styleUrl: './article-creation.component.scss'
})
export class ArticleCreationComponent implements OnInit, OnDestroy
{
    articleForm = new FormGroup({
        subject: new FormControl('', { 
            validators: [ Validators.required ],
            nonNullable: true
        }),
        title: new FormControl('', {
            validators: Validators.required,
            nonNullable: true
        }),
        content: new FormControl('', {
            validators: Validators.required,
            nonNullable: true
        })
    })

    subjects?: Subject[];

    subjectsSubscription?: Subscription;
    articleSubscription?: Subscription;

    constructor(
        private subjectService: SubjectService,
        private sessionService: SessionService,
        private articleService: ArticleService,
        private messageService: MessageService,
        private router: Router,
        private location: Location
    ) {}

    ngOnInit(): void 
    {
        this.subjectsSubscription = this.subjectService.getAll().subscribe({
            next: subjects => {
                this.subjects = subjects;
            },
            error: _ => this.messageService.add({severity: 'error', summary:  'Erreur durant le chargement des thèmes', detail: `Veuillez réessayer plus tard` })
        });
    }

    ngOnDestroy(): void 
    {
        this.subjectsSubscription?.unsubscribe();
        this.articleSubscription?.unsubscribe();
    }

    onBackButtonClicked(): void
    {
        this.location.back();
    }

    onSubmit(): void 
    {
        const authorId: number = this.sessionService.sessionInfo!.user.id;
        const formData = this.articleForm.getRawValue();
        const request: ArticleCreationRequest = {
            title: formData.title,
            content: formData.content,
            subjectId: (<Subject> <unknown> formData.subject).id,
            authorId: authorId
        };
        this.articleSubscription = this.articleService.add(request).subscribe({
            next: response => 
            {
                this.articleForm.reset();
                this.messageService.add({severity: 'success', summary:  'Article publié', detail: `${response.message}` });
                
                // Reload page
                this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                    this.router.navigate([`/article/${response.article.id}`]);
                });
            },
            error: _ => this.messageService.add({severity: 'error', summary:  "Erreur durant la création de l'article", detail: `Veuillez réessayer plus tard` })
        });
    }
}
