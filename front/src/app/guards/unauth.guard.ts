import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../auth/services/session.service';

export const unauthGuard: CanActivateFn = (route, state) => 
{
    const sessionService = inject(SessionService);
    const router = inject(Router);
    if (sessionService.isLogged) {
        router.navigate(['/feed']);
        return false;
    }
    return true;
};
