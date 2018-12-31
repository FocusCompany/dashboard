import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models/user';

@Injectable()
export class UserService {
    constructor(private http: HttpClient) { }

    register(user: User) {
        return this.http.post('http://auth.thefocuscompany.me:3000/api/v1/register', user);
    }

    update(user: any) {
        return this.http.put('http://auth.thefocuscompany.me:3000/api/v1/update_user', user);
    }
}
