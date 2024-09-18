import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [ CommonModule, ButtonModule, ChipModule, DividerModule, AvatarModule, CardModule, InputTextareaModule, ReactiveFormsModule, MessagesModule ],
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.scss'
})
export class ArticleDetailComponent implements OnInit, OnDestroy
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

    articlesSubscription?: Subscription;

    constructor (
        private articleService: ArticleService,
        private activatedRoute: ActivatedRoute,
        private sessionService: SessionService,
        private messageService: MessageService,
        private router: Router,
        private location: Location
    ) {}


    ngOnInit(): void 
    {
        const id: number = this.activatedRoute.snapshot.params['id'];
        this.articlesSubscription = this.articleService.getById(id).subscribe({
            next: article => {
                this.article = article;
            },
            error: _ => this.messageService.add({severity: 'error', summary:  "Erreur durant le chargement de l'article", detail: `Veuillez réessayer plus tard` }) 
        });
    }

    ngOnDestroy(): void 
    {
        this.articlesSubscription?.unsubscribe();
    }

    onBackButtonClicked(): void
    {
        this.location.back();
    }

    onSendComment(): void
    {
        const authorId: number = this.sessionService.sessionInfo!.user.id;
        const content: string = this.commentCreationForm.getRawValue().comment;
        const articleId: number = this.activatedRoute.snapshot.params['id'];
        const request: CommentCreationRequest = {
            content: content,
            authorId: authorId
        }
        this.articleService.comment(articleId, request).subscribe({
            next: response => 
            {
                this.commentCreationForm.reset();
                this.messageService.add({severity: 'success', summary:  'Commentaire envoyé', detail: `${response.message}` });
                
                // Reload page
                this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                    this.router.navigate([`/article/${articleId}`]);
                });
            },
            error: _ => this.messageService.add({severity: 'error', summary:  "Erreur durant la création du commentaire", detail: `Veuillez réessayer plus tard` })
        });
    }
}
