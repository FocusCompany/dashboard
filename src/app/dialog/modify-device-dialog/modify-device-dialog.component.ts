import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {Collection} from '../../_models/collection';
import {CollectionsService} from '../../_services/collections.service';

@Component({
    selector: 'app-modify-device-dialog',
    templateUrl: './modify-device-dialog.component.html',
    styleUrls: ['./modify-device-dialog.component.css']
})
export class ModifyDeviceDialogComponent implements OnInit {

    selectedCollections = [];
    collections = [];

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ModifyDeviceDialogComponent>,
        private collectionService: CollectionsService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit() {
        const selectedCollections = this.data.device.collections as Array<Collection>;
        selectedCollections.forEach(obj => {
            this.selectedCollections.push(obj.collections_name);
        });

        this.collectionService.getCollections().subscribe((collections: Array<Collection>) => {
            const list = [];
            collections.forEach(obj => {
                list.push({name: obj.collections_name});
            });
            this.collections = list;
        });
    }

    save() {
        this.dialogRef.close(this.selectedCollections);
    }

    close() {
        this.dialogRef.close();
    }
}
