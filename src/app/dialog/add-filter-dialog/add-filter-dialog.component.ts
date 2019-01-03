import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {FiltersService} from '../../_services/filters.service';

@Component({
    selector: 'app-add-filter-dialog',
    templateUrl: './add-filter-dialog.component.html',
    styleUrls: ['./add-filter-dialog.component.css']
})
export class AddFilterDialogComponent implements OnInit {

    selectedProcess: string[];

    process = [];

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<AddFilterDialogComponent>,
        private filterService: FiltersService) {
    }

    ngOnInit() {
        this.filterService.getProcess().subscribe((process: Array<string>) => {
            const list = [];
            process.forEach(obj => {
                list.push({name: obj});
            });
            this.process = list;
        });
    }

    save() {
        this.dialogRef.close(this.selectedProcess);
    }

    close() {
        this.dialogRef.close();
    }
}
