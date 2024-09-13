import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Article } from '../../interfaces/article.interface';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-article-card',
  standalone: true,
  imports: [  CommonModule, CardModule, ButtonModule],
  templateUrl: './article-card.component.html',
  styleUrl: './article-card.component.scss',
})
export class ArticleCardComponent implements AfterViewInit
{
    @Input() article!: Article;

    @ViewChild('content') contentDiv!: ElementRef;

    isContentLong: boolean = false;

    constructor(
        private router: Router,
        private changeDetectorRef: ChangeDetectorRef) {}

    ngAfterViewInit() 
    {
        // Display "Read More" if article is long enough
        const height: number = this.contentDiv.nativeElement.offsetHeight;
        if (height >= 100) {
            this.isContentLong = true;
            this.changeDetectorRef.detectChanges();
        }
    }

    onArticleClicked() 
    {
        this.router.navigate([`/article/${this.article.id}`])
    }
}
