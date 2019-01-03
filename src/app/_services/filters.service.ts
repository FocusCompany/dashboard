import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class FiltersService {
    constructor(private http: HttpClient) {
    }

    getFilters(): any {
        return this.http.get('/backend/filters');
    }

    setFilters(filters: string) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        return this.http.post('/backend/filters', 'filters=' + filters, {headers});
    }

    getProcess() {
        return this.http.post('/backend/process/list', null);
    }
}
