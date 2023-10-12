
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class HttpService {
  errorMessage = 'Server Error';
  // Resolve HTTP using the constructor
  constructor(
    private localStorageService: LocalStorageService,
    private _cookieService: CookieService,
    private http: HttpClient) {

  }

  /**
  * @desc - get request
  * @param url - url of API
  */
  get(url: string): Observable<any> {
    // using get request
    return this.http.get(url, {
      headers: this.setHeaders()
    }).pipe(map((res: any) => res), catchError((err: any) => {
      return throwError({
        error: err['error'] || this.errorMessage
      });
    }));

  }

  download(url: string, filters: any): Promise<any> {

    const headerObj: Object = {
      responseType: 'arraybuffer',
      observe: 'response',
      headers: this.setHeaders()
    };
    return this.http.get(url, headerObj)
      .toPromise()
      .then((res: any) => {
        return res;
      }).catch((err: any) => {
        return Promise.reject({
          error: err['error'] || this.errorMessage
        });
      });
  }



  setHeaders() {
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() - 1);
    const authKey = this.localStorageService.get('accesstoken');
    // Create a request option
    const header = new HttpHeaders({
      'Authorization': 'Bearer ' + authKey,
      'Content-Type': 'application/json',
      'Cache-control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': `${expiryDate}`
    });
    return header;
  }

  getCookie(key: string) {
    return this._cookieService.get(key);
  }

  setCookie(key: string, value: string) {
    return this._cookieService.set(key, value);
  }

  removeCookie(key: string) {
    return this._cookieService.delete(key);
  }

  
  

}
