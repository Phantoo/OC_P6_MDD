import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { urlInterceptor } from './interceptors/url.interceptor';
import { authInterceptor } from './interceptors/auth.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { tokenExpirationInterceptor } from './interceptors/token-expiration.interceptor';
import { CookieModule, CookieService } from 'ngx-cookie';

export const appConfig: ApplicationConfig = {
    providers: [ 
        provideRouter(routes), 
        provideClientHydration(), 
        provideHttpClient(withFetch(), withInterceptors([urlInterceptor, authInterceptor, tokenExpirationInterceptor])),
        provideAnimations(), importProvidersFrom(CookieModule.withOptions())
    ],
};
