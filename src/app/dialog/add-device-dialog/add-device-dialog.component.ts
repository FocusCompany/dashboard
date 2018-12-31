import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-add-device-dialog',
    templateUrl: './add-device-dialog.component.html',
    styleUrls: ['./add-device-dialog.component.css']
})
export class AddDeviceDialogComponent implements OnInit {

    form: FormGroup;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<AddDeviceDialogComponent>) {

        this.form = fb.group({
            deviceName: ['', Validators.required]
        });
    }

    ngOnInit() {
    }

    save() {
        this.dialogRef.close(this.form.value.deviceName);
    }

    close() {
        this.dialogRef.close();
    }
}