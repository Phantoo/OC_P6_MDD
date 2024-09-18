import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { FeedComponent } from './pages/feed/feed.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ArticleDetailComponent } from './pages/article-detail/article-detail.component';
import { ArticleCreationComponent } from './pages/article-creation/article-creation.component';
import { SubjectsComponent } from './pages/subjects/subjects.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { authGuard } from './guards/auth.guard';
import { unauthGuard } from './guards/unauth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'feed', pathMatch: 'full' },
    { path: 'feed', component: FeedComponent, canActivate: [authGuard] },
    { path: 'landing', component: LandingComponent, canActivate: [unauthGuard] },
    
    { path: 'login', component: LoginComponent, canActivate: [unauthGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [unauthGuard] },

    { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },

    { path: 'article', component: ArticleCreationComponent, canActivate: [authGuard] },
    { path: 'article/:id', component: ArticleDetailComponent, canActivate: [authGuard] },

    { path: 'subjects', component: SubjectsComponent, canActivate: [authGuard] },
    
    { path: '**', redirectTo: 'feed' },
];
