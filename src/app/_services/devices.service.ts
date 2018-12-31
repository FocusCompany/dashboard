import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import {Device} from '../_models/device';

@Injectable()
export class DevicesService {

    constructor(private http: HttpClient) {}

    public getDevices(): Observable<Array<Device>> {
        return this.http.get<Array<Device>>('http://auth.thefocuscompany.me:3000/api/v1/get_devices').map((payload: any) => {
            if (payload && payload.devices) {
                return payload.devices;
            }
        });
    }

    public deleteDevices(device_id: string, keep_data?: string): Observable<Array<Device>> {
        let options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: {device_id: device_id, keep_data: keep_data === undefined  ? 'false' : keep_data}
        };
        return this.http.delete<any>('http://auth.thefocuscompany.me:3000/api/v1/delete_device', options);
    }

    public addDevices(devices_name: string): Observable<any> {
        return this.http.post<any>('http://auth.thefocuscompany.me:3000/api/v1/register_device', {devices_name});
    }
}
