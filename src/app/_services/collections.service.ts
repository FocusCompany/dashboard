import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import {Collection} from '../_models/collection';
import {Device} from '../_models/device';

@Injectable()
export class CollectionsService {

    constructor(private http: HttpClient) {}

    public getCollections(): Observable<Array<Collection>> {
        return this.http.get<Array<Collection>>('/auth/api/v1/list_group').map((payload: any) => {
            if (payload && payload.collections) {
                return payload.collections;
            }
        });
    }

    public deleteCollections(collections_name: string): Observable<Array<Device>> {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: {collections_name: collections_name}
        };
        return this.http.delete<any>('/auth/api/v1/delete_group', options);
    }

    public addCollections(collections_name: string): Observable<any> {
        return this.http.post<any>('/auth/api/v1/create_group', {collections_name});
    }

    public addDeviceToCollection(collections_name: string, device_id: string): Observable<any> {
        return this.http.post<any>('/auth/api/v1/add_device_to_group', {collections_name, device_id});
    }

    public deleteDeviceFromCollection(collections_name: string, device_id: string): Observable<Array<Device>> {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: {collections_name, device_id}
        };
        return this.http.delete<any>('/auth/api/v1/remove_device_from_group', options);
    }
}
