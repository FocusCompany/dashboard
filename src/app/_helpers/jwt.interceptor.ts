import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthenticationService } from '../_services/authentication.service';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    private helper = new JwtHelperService();

    constructor(private router: Router,
                private authenticationService: AuthenticationService) {}

    addAuthHeader(request: HttpRequest<any>, token: string) {
        if (request.url.startsWith('http://backend.') && (request.method === 'POST' || request.method === 'GET')) {
            request = request.clone({
                setHeaders: {
                    Authorization: `${token}`
                }
            });
        } else {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }
        return request;
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.url.endsWith('/renew_jwt') && request.method === 'POST') {
            return next.handle(request);
        }

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            if (this.helper.isTokenExpired(currentUser.token)) {
                return this.authenticationService.renewToken().switchMap(() => {
                    const tmp = JSON.parse(localStorage.getItem('currentUser'));
                    request = this.addAuthHeader(request, tmp.token);
                    return next.handle(request);
                });
            } else {
                request = this.addAuthHeader(request, currentUser.token);
            }
        }
        return next.handle(request);
    }
}
