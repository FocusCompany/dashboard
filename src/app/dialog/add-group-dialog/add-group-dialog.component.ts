import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-add-group-dialog',
    templateUrl: './add-group-dialog.component.html',
    styleUrls: ['./add-group-dialog.component.css']
})
export class AddGroupDialogComponent implements OnInit {

    form: FormGroup;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<AddGroupDialogComponent>) {

        this.form = fb.group({
            groupName: ['', Validators.required]
        });
    }

    ngOnInit() {
    }

    save() {
        this.dialogRef.close(this.form.value.groupName);
    }

    close() {
        this.dialogRef.close();
    }
}