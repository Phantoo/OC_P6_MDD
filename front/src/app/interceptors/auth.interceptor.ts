import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionService } from '../auth/services/session.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => 
{
    const sessionService = inject(SessionService);

    // If user is logged in, fill request heqder with its authentication token
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
