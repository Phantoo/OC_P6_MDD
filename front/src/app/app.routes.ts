import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { FeedComponent } from './pages/feed/feed.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ArticleDetailComponent } from './pages/article-detail/article-detail.component';
import { ArticleCreationComponent } from './pages/article-creation/article-creation.component';
import { SubjectsComponent } from './pages/subjects/subjects.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
    { path: '', redirectTo: 'feed', pathMatch: 'full' },
    { path: 'feed', component: FeedComponent },
    { path: 'landing', component: LandingComponent },
    
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    { path: 'profile', component: ProfileComponent },

    { path: 'article', component: ArticleCreationComponent },
    { path: 'article/:id', component: ArticleDetailComponent },

    { path: 'subjects', component: SubjectsComponent },
    
    { path: '**', redirectTo: 'feed' },
];
