import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { SessionService } from '../auth/services/session.service';

export const tokenExpirationInterceptor: HttpInterceptorFn = (req, next) => 
{
    let sessionService: SessionService = inject(SessionService);
    let router: Router = inject(Router);
    return next(req).pipe(tap(event => 
    {
        if (event.type === HttpEventType.Response &&
            sessionService.isLogged &&
            event.status == 401) 
        {
            console.log('Token is expired, redirecting to landing page');
            sessionService.logOut();
            router.navigate(['/landing'])
        }
    }));
};
