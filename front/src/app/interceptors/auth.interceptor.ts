import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionService } from '../auth/services/session.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => 
{
    const sessionService = inject(SessionService);
    if (sessionService.isLogged)
    {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${sessionService.sessionInfo?.token!}`
            }
        });
    }

    return next(req);
};
