import {Component, OnInit} from '@angular/core';
import {AlertService} from '../_services/alert.service';
import {UserService} from '../_services/user.service';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
    model: any = {};
    loading = false;

    constructor(private alertService: AlertService,
                private userService: UserService) {
    }

    ngOnInit() {
    }

    public updateProfil() {
        console.log(this.model);
        this.loading = true;
        this.userService.update(this.model).subscribe(
            data => {
                this.alertService.showNotification('top', 'center', 'success', 'User successfully updated');
                this.loading = false;
            },
            error => {
                this.alertService.showNotification('top', 'center', 'danger', 'An error occurred');
                this.loading = false;
            });
    }
}
