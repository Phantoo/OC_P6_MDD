import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { urlInterceptor } from './interceptors/url.interceptor';
import { authInterceptor } from './interceptors/auth.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PlatformService } from './services/platform.service';
import { tokenExpirationInterceptor } from './interceptors/token-expiration.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [ 
        provideRouter(routes), 
        provideClientHydration(), 
        provideHttpClient(withFetch(), withInterceptors([urlInterceptor, authInterceptor, tokenExpirationInterceptor])),
        provideAnimations()
    ],
};
