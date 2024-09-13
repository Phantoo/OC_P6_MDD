import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../auth/services/session.service';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ArticleCardComponent } from '../../components/article-card/article-card.component';
import { Article } from '../../interfaces/article.interface';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../../services/article.service';
import { delay } from 'rxjs';
import { PlatformService } from '../../services/platform.service';
import { MenuModule } from 'primeng/menu';
import { PrimeIcons } from 'primeng/api';
import { Subject } from '../../interfaces/subject.interface';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [ CommonModule, ButtonModule, CardModule, ArticleCardComponent, CardModule, SkeletonModule, PaginatorModule, MenuModule ],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent implements OnInit
{
    isLoading: boolean = true;
    articles: Article[] = [];

    totalNumberOfArticles?: number;
    currentPage?: number = 0;
    elementsPerPage: number[] = [1, 5, 10];
    currentSize?: number = this.elementsPerPage[1];

    userSubjects!: Subject[];

    invertSort: boolean = false;
    sortIcon: string = PrimeIcons.SORT_NUMERIC_DOWN;

    constructor(
        private sessionService: SessionService,
        private articleService: ArticleService,
        public platformService: PlatformService,
        private router: Router) {}

    ngOnInit(): void 
    {
        if (this.sessionService.isLogged === false ||
            this.sessionService.sessionInfo == undefined) {
            this.router.navigate(['landing']);
            return;
        }

        this.userSubjects = this.sessionService.sessionInfo?.user.subjects;

        // Fetch articles
        this.articleService
            .getAll(this.currentPage, this.currentSize, this.userSubjects)
            .pipe(delay(1000))
            .subscribe((data) => this.onArticlesFetched(data));
    }

    onPageChanged(state: PaginatorState)
    {
        this.currentPage = state.page;
        this.currentSize = state.rows;
        this.isLoading = true;
        this.articleService
            .getAll(this.currentPage, this.currentSize, this.userSubjects)
            .subscribe((data) => this.onArticlesFetched(data));
    }

    onArticlesFetched(data:any)
    {
        this.isLoading = false;
        this.articles = data['content'];
        this.articles.sort((a, b) => {
            return this.invertSort ?
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime():
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        })
        this.totalNumberOfArticles = data['totalElements']
    }

    onSortButtonClicked()
    {
        this.invertSort = !this.invertSort;
        this.sortIcon = this.invertSort ?
            PrimeIcons.SORT_NUMERIC_UP :
            PrimeIcons.SORT_NUMERIC_DOWN;
        this.isLoading = true;
        this.articleService
            .getAll(this.currentPage, this.currentSize, this.userSubjects)
            .subscribe((data) => this.onArticlesFetched(data));
    }

    onCreateButtonClicked() {
        this.router.navigate(['/article'])
    }
}
