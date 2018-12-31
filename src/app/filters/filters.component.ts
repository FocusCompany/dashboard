import {Component, OnInit} from '@angular/core';
import {FiltersService} from '../_services/filters.service';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {AddDeviceDialogComponent} from '../dialog/add-device-dialog/add-device-dialog.component';
import {AddFilterDialogComponent} from '../dialog/add-filter-dialog/add-filter-dialog.component';
import {AlertService} from '../_services/alert.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-icons',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

    filters: Array<string>;

    constructor(private filterService: FiltersService,
                private dialog: MatDialog,
                private alertService: AlertService) {
    }

    ngOnInit() {
        this.filterService.getFilters().subscribe((filters: Array<string>) => {
            this.filters = filters;
        });
    }

    public addFilter() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.autoFocus = true;
        const dialogRef = this.dialog.open(AddFilterDialogComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(
            (listProcess: Array<string>) => {
                if (listProcess) {
                    let filterList = JSON.parse(JSON.stringify(this.filters));
                    listProcess.forEach((process: string) => {
                        if (filterList.indexOf(process) === -1) {
                            filterList.push(process);
                        }
                    });
                    this.filterService.setFilters(filterList.join(',')).subscribe(
                        data => {
                            this.alertService.showNotification('top', 'center', 'success', 'Filter added');
                            this.filterService.getFilters().subscribe((filters: Array<string>) => {
                                this.filters = filters;
                            });
                        },
                        error => {
                            this.alertService.showNotification('top', 'center', 'danger', 'An error occurred');
                        });
                }
            });
    }

    public deleteFilter(name: string) {
        let filterList = JSON.parse(JSON.stringify(this.filters));
        filterList.splice(this.filters.indexOf(name), 1);
        this.filterService.setFilters(filterList.join(',')).subscribe(
            data => {
                this.alertService.showNotification('top', 'center', 'success', 'Filter deleted');
                this.filterService.getFilters().subscribe((filters: Array<string>) => {
                    this.filters = filters;
                });
            },
            error => {
                this.alertService.showNotification('top', 'center', 'danger', 'An error occurred');
            });
    }
}
