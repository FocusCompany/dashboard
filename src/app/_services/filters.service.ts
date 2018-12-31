import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class FiltersService {
    constructor(private http: HttpClient) {
    }

    getFilters(): any {
        return this.http.get('http://backend.thefocuscompany.me:8080/filters');
    }

    setFilters(filters: string) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        return this.http.post('http://backend.thefocuscompany.me:8080/filters', 'filters=' + filters, {headers});
    }

    getProcess() {
        return this.http.post('http://backend.thefocuscompany.me:8080/process/list', null);
    }
}
