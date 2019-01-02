import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class UrlInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const url = (req.url.startsWith('/backend')) ? 'http://backend.thefocuscompany.me:8080' : 'http://auth.thefocuscompany.me:3000';
        req = req.clone({
            url: url + ((req.url.startsWith('/backend')) ? req.url.replace('/backend/', '/') : req.url.replace('/auth/', '/'))
        });
        return next.handle(req);
    }
}
