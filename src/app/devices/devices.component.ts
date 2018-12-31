import {Component, OnInit} from '@angular/core';
import {DevicesService} from '../_services/devices.service';
import {Device} from '../_models/device';
import {CollectionsService} from '../_services/collections.service';
import {Collection} from '../_models/collection';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {AddDeviceDialogComponent} from '../dialog/add-device-dialog/add-device-dialog.component';
import {AddGroupDialogComponent} from '../dialog/add-group-dialog/add-group-dialog.component';
import {AlertService} from '../_services/alert.service';
import {ModifyDeviceDialogComponent} from '../dialog/modify-device-dialog/modify-device-dialog.component';

@Component({
    selector: 'app-table-list',
    templateUrl: './devices.component.html',
    styleUrls: ['./devices.component.css']
})
export class DevicesComponent implements OnInit {

    devices: Array<Device>;
    collections: Array<Collection>;

    constructor(private deviceService: DevicesService,
                private collectionService: CollectionsService,
                private dialog: MatDialog,
                private alertService: AlertService) {
    }

    ngOnInit() {
        this.deviceService.getDevices().subscribe((devices: Array<Device>) => {
            this.devices = devices;
        });

        this.collectionService.getCollections().subscribe((collections: Array<Collection>) => {
            this.collections = collections;
        });
    }

    public addDevice() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.autoFocus = true;
        const dialogRef = this.dialog.open(AddDeviceDialogComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(
            (devices_name: string) => {
                this.deviceService.addDevices(devices_name).subscribe(
                    data => {
                        this.alertService.showNotification('top', 'center', 'success', 'Device added');
                        this.deviceService.getDevices().subscribe((devices: Array<Device>) => {
                            this.devices = devices;
                        });
                    },
                    error => {
                        this.alertService.showNotification('top', 'center', 'danger', 'An error occurred');
                    });
            });
    }

    public addGroup() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.autoFocus = true;
        const dialogRef = this.dialog.open(AddGroupDialogComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(
            (collections_name: string) => {
                this.collectionService.addCollections(collections_name).subscribe(
                    data => {
                        this.alertService.showNotification('top', 'center', 'success', 'Group added');
                        this.collectionService.getCollections().subscribe((collections: Array<Collection>) => {
                            this.collections = collections;
                        });
                    },
                    error => {
                        this.alertService.showNotification('top', 'center', 'danger', 'An error occurred');
                    });
            });
    }

    public editDevice(device: Device) {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.autoFocus = true;
        dialogConfig.data = {device};
        const dialogRef = this.dialog.open(ModifyDeviceDialogComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(
            (listCollections: Array<string>) => {
                if (listCollections) {
                    device.collections.forEach((collection: Collection) => {
                        if (listCollections.includes(collection.collections_name)) {
                            listCollections.splice(listCollections.indexOf(collection.collections_name), 1);
                        } else {
                            this.collectionService.deleteDeviceFromCollection(collection.collections_name,
                                device.id_devices.toString()).subscribe(data => {
                                this.deviceService.getDevices().subscribe((devices: Array<Device>) => {
                                    this.devices = devices;
                                });
                            });

                        }
                    });
                    listCollections.forEach((collections_name: string) => {
                        this.collectionService.addDeviceToCollection(collections_name,
                            device.id_devices.toString()).subscribe(data => {
                            this.deviceService.getDevices().subscribe((devices: Array<Device>) => {
                                this.devices = devices;
                            });
                        });
                    });
                }
            });
    }

    public deleteDevice(id: number) {
        this.deviceService.deleteDevices(id.toString()).subscribe(
            data => {
                this.alertService.showNotification('top', 'center', 'success', 'Device deleted');
                this.deviceService.getDevices().subscribe((devices: Array<Device>) => {
                    this.devices = devices;
                });
            },
            error => {
                this.alertService.showNotification('top', 'center', 'danger', 'An error occurred');
            });
    }

    public deleteGroup(name: string) {
        this.collectionService.deleteCollections(name).subscribe(
            data => {
                this.alertService.showNotification('top', 'center', 'success', 'Collection deleted');
                this.collectionService.getCollections().subscribe((collections: Array<Collection>) => {
                    this.collections = collections;
                });
            },
            error => {
                this.alertService.showNotification('top', 'center', 'danger', 'An error occurred');
            });
    }
}
