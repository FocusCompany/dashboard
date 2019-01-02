import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {
    constructor(private http: HttpClient) { }

    login(email: string, password: string) {
        return this.http.post<any>('/auth/api/v1/login', {email: email, password: password})
                   .map(user => {
                       if (user && user.token) {
                           localStorage.setItem('currentUser', JSON.stringify(user));
                       }
                       return user;
                   });
    }

    renewToken() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            return this.http.post<any>('/auth/api/v1/renew_jwt', {token: currentUser.token})
                       .map(user => {
                           if (user && user.token) {
                               localStorage.removeItem('currentUser');
                               localStorage.setItem('currentUser', JSON.stringify(user));
                           }
                           return user;
                       });
        }
    }

    logout() {
        localStorage.removeItem('currentUser');
    }
}
