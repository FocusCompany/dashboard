import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import {Dnd, Process} from '../_models/stats';

@Injectable()
export class StatsService {

    constructor(private http: HttpClient) {}

    toUrlEncoded = obj => Object.keys(obj).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])).join('&');

    public getProcess(device: string, group: string, from: string, to: string): Observable<Array<Process>> {
        const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
        const body = {from, to};

        if (device) { body['device'] = device; }
        if (group) { body['group'] = group; }

        return this.http.post<Array<Process>>('http://backend.thefocuscompany.me:8080/process', this.toUrlEncoded(body), {headers});
    }

    public getDnd(): Observable<Dnd> {
        return this.http.get<Dnd>('http://backend.thefocuscompany.me:8080/dnd');
    }
}
