import {Collection} from './collection';

export class Device {
    id_devices: number;
    devices_name: string;
    is_deleted: boolean;
    users_uuid: string;
    collections: Array<Collection>;
}
