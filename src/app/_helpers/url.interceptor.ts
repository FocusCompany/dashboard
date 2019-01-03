import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment';

@Injectable()
export class UrlInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const url = (req.url.startsWith('/backend')) ? environment.baseUrlBack : environment.baseUrlAuth;
        req = req.clone({
            url: url + ((req.url.startsWith('/backend')) ? req.url.replace('/backend/', '/') : req.url.replace('/auth/', '/'))
        });
        return next.handle(req);
    }
}
