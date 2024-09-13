import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-article-creation',
  standalone: true,
  imports: [ ButtonModule, FloatLabelModule, ReactiveFormsModule, InputTextareaModule, InputTextModule, DropdownModule ],
  templateUrl: './article-creation.component.html',
  styleUrl: './article-creation.component.scss'
})
export class ArticleCreationComponent implements OnInit
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

    constructor(
        private subjectService: SubjectService,
        private sessionService: SessionService,
        private articleService: ArticleService,
        private messageService: MessageService,
        private router: Router,
        private location: Location
    ) {}

    ngOnInit() 
    {
        this.subjectService.getAll().subscribe(subjects => {
            this.subjects = subjects;
        })
    }

    onBackButtonClicked() {
        this.location.back();
    }

    onSubmit() 
    {
        const authorId: number | undefined = this.sessionService.sessionInfo?.user.id;
        if (authorId === undefined)
        {
            this.router.navigate(['/landing']);
            return;
        }

        const formData = this.articleForm.getRawValue();
        const request: ArticleCreationRequest = {
            title: formData.title,
            content: formData.content,
            subjectId: (<Subject> <unknown> formData.subject).id,
            authorId: authorId
        };
        this.articleService.add(request).subscribe(response => 
            {
                this.articleForm.reset();
                this.messageService.add({severity: 'success', summary:  'Article publié', detail: `${response.message}` });
                
                // Reload page
                this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                    this.router.navigate([`/article/${response.article.id}`]);
                });
            });
    }
}
