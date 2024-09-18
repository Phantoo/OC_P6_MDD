import { Component, OnDestroy, OnInit } from '@angular/core';
import { SessionService } from '../../auth/services/session.service';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessagesModule } from 'primeng/messages';
import { SkeletonModule } from 'primeng/skeleton';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ArticleCardComponent } from '../../components/article-card/article-card.component';
import { Article } from '../../interfaces/article.interface';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../../services/article.service';
import { delay, Subscription } from 'rxjs';
import { PlatformService } from '../../services/platform.service';
import { MenuModule } from 'primeng/menu';
import { Message, MessageService, PrimeIcons } from 'primeng/api';
import { Subject } from '../../interfaces/subject.interface';
import { Page } from '../../interfaces/page.interface';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [ CommonModule, ButtonModule, CardModule, ArticleCardComponent, CardModule, SkeletonModule, PaginatorModule, MenuModule, MessagesModule ],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent implements OnInit, OnDestroy
{
    isLoading: boolean = true;
    articles: Article[] = [];

    articleSubscription?: Subscription;

    totalNumberOfArticles: number = 0;
    currentPage?: number = 0;
    elementsPerPage: number[] = [1, 5, 10];
    currentSize?: number = this.elementsPerPage[2];

    userSubjects?: Subject[];

    invertSort: boolean = false;
    sortIcon: string = PrimeIcons.SORT_NUMERIC_DOWN;

    emptyFeedMessage: Message[] = [
        {
            severity: "error",
            summary: "Aucun article ne correspond aux thèmes que vous suivez"
        }
    ]

    constructor(
        private sessionService: SessionService,
        private articleService: ArticleService,
        public platformService: PlatformService,
        private messageService: MessageService,
        private router: Router) {}

    ngOnInit(): void 
    {
        this.userSubjects = this.sessionService.sessionInfo!.user.subjects;

        // Fetch articles
        this.articleSubscription = this.articleService
            .getAll(this.currentPage, this.currentSize, this.userSubjects!)
            .pipe(delay(1000))
            .subscribe({
                next: (page: Page) => this.onArticlesFetched(page),
                error: _ => this.onArticlesFailed()
            });
    }

    ngOnDestroy(): void 
    {
        this.articleSubscription?.unsubscribe();
    }

    onPageChanged(state: PaginatorState): void
    {
        this.currentPage = state.page;
        this.currentSize = state.rows;
        this.isLoading = true;
        this.articleSubscription?.unsubscribe();
        this.articleSubscription = this.articleService
            .getAll(this.currentPage, this.currentSize, this.userSubjects!)
            .subscribe({
                next: (page: Page) => this.onArticlesFetched(page),
                error: _ => this.onArticlesFailed()
            });
    }

    onArticlesFetched(page: Page): void
    {
        this.isLoading = false;
        this.articles = page.content;
        this.articles.sort((a, b) => {
            return this.invertSort ?
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime():
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        })
        this.totalNumberOfArticles = page.totalElements;
    }

    onArticlesFailed(): void
    {
        this.isLoading = false;
        this.messageService.add({severity: 'error', summary:  'Erreur durant le chargement des articles', detail: `Veuillez réessayer plus tard` });
    }

    onSortButtonClicked(): void
    {
        this.invertSort = !this.invertSort;
        this.sortIcon = this.invertSort ?
            PrimeIcons.SORT_NUMERIC_UP :
            PrimeIcons.SORT_NUMERIC_DOWN;
        this.isLoading = true;
        this.articleSubscription?.unsubscribe();
        this.articleSubscription = this.articleService
            .getAll(this.currentPage, this.currentSize, this.userSubjects!)
            .subscribe({
                next: (page: Page) => this.onArticlesFetched(page),
                error: _ => this.onArticlesFailed()
            });
    }

    onCreateButtonClicked(): void {
        this.router.navigate(['/article'])
    }
}
