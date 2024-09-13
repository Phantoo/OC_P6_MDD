import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Article } from '../../interfaces/article.interface';
import { ArticleService } from '../../services/article.service';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { CommonModule, Location } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { MessagesModule } from 'primeng/messages';
import { CardModule } from 'primeng/card';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentCreationRequest } from '../../interfaces/comment-creation-request.interface';
import { SessionService } from '../../auth/services/session.service';
import { Message, MessageService } from 'primeng/api';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [ CommonModule, ButtonModule, ChipModule, DividerModule, AvatarModule, CardModule, InputTextareaModule, ReactiveFormsModule, MessagesModule ],
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.scss'
})
export class ArticleDetailComponent implements OnInit
{
    article?: Article;
    
    commentCreationForm = new FormGroup({
        comment: new FormControl('', { 
            validators: Validators.required,
            nonNullable: true
        })
    })

    emptyCommentsMessage: Message[] = [
        {
            severity: "warn",
            summary: "Soyez le premier à réagir"
        }
    ]

    constructor (
        private articleService: ArticleService,
        private activatedRoute: ActivatedRoute,
        private sessionService: SessionService,
        private messageService: MessageService,
        private router: Router,
        private location: Location
    ) {}

    ngOnInit() 
    {
        const id: number = this.activatedRoute.snapshot.params['id'];
        this.articleService.getById(id).subscribe(article => {
            this.article = article;
        });
    }

    onBackButtonClicked() {
        this.location.back();
    }

    onSendComment()
    {
        const content: string = this.commentCreationForm.getRawValue().comment;
        const authorId: number | undefined = this.sessionService.sessionInfo?.user.id;
        if (authorId === undefined)
        {
            this.router.navigate(['/landing']);
            return;
        }

        const articleId: number = this.activatedRoute.snapshot.params['id'];
        const request: CommentCreationRequest = {
            content: content,
            authorId: authorId
        }
        this.articleService.comment(articleId, request).subscribe(response => 
        {
            this.commentCreationForm.reset();
            this.messageService.add({severity: 'success', summary:  'Commentaire envoyé', detail: `${response.message}` });
            
            // Reload page
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                this.router.navigate([`/article/${articleId}`]);
            });
        });
    }
}
