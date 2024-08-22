import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const urlInterceptor: HttpInterceptorFn = (req, next) => 
{
    const apiReq = req.clone({ url: `${environment.API_URL}/${req.url}` });
    return next(apiReq);
};
