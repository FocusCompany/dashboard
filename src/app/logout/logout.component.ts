import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {AuthenticationService} from '../_services/authentication.service';

@Component({
    template: ''
})

export class LogoutComponent implements OnInit {

    constructor(private _authService: AuthenticationService, private router: Router) {}

    ngOnInit() {
        this._authService.logout();
        this.router.navigate(['/login']);
    }
}