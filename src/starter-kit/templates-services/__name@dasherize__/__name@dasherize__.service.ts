import { Injectable } from '@angular/core'
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { Observable } from 'rxjs'

@Injectable()
export class <%= classify(name) %>Service {
    apiUrl: string
	headers: HttpHeaders = new HttpHeaders()
    defaultParams = []
    constructor(private http: HttpClient) {
		this.apiUrl = environment.url
    }
    get(url, from_params = {}, user = null, no_headers = false, no_format = false, responseType = {}): Observable<any> {
		let params: HttpParams = new HttpParams()
		for (const p of Object.keys(this.defaultParams)) {
			params = params.set(p, this.defaultParams[p])
		}
		if (!no_format) {
			params = params.append('_format', 'json')
		}
		// set params
		for (const key of Object.keys(from_params)) {
			if (from_params[key]) {
				params = params.set(key, from_params[key])
			}
		}
		return this.http.get(this.apiUrl + url, {
			headers: this.headers,
			params,
			...responseType,
		})
    }
}