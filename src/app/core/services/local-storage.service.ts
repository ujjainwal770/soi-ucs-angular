import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor(
    private readonly _router: Router
  ) { }
  /**
   * Will set the data into session storage
   * @storageKey: The key against which the data is to store
   * @data: The data to store
   */
  set(storageKey: string, data: any) {
    localStorage.setItem(storageKey, data);
  }

  /**
   * Will get the data from session storage
   * @storageKey: The key against which the data is stored
   */
  get(storageKey: string) {
    return localStorage[storageKey];
  }

  /**
   * Will remove the data from session storage
   * @storageKey: The key against which the data is stored
   */
  remove(storageKey: string) {
    delete localStorage[storageKey];
  }

  encryptData(data) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), 'secret key 123').toString();
    } catch (e) {
      //console.log(e);
    }
  }

  decryptData(data) {
    try {
      const bytes = CryptoJS.AES.decrypt(data, 'secret key 123');
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return data;
    } catch (e) {
      //console.log(e);
    }
  }
  removeSeessionData() {
    localStorage.removeItem('accesstoken');
    localStorage.removeItem('adminType');
    this._router.navigate(['/auth/home']);
  }

  removeAll() {
    localStorage.clear();
  }

  getAdminType() {
    let adminType = localStorage['UserData'] ? 'SCHOOL_ADMIN' : 'SOUCS_ADMIN';
    return adminType;
  }

  isSchoolAdmin() {
    if (this.getAdminType() === 'SCHOOL_ADMIN') {
      return true;
    } else {
      return false;
    }
  }

  isSoucsAdmin() {
    if (this.getAdminType() === 'SOUCS_ADMIN') {
      return true;
    } else {
      return false;
    }
  }

  getSchoolAdminUserData() {
    let userData = localStorage['UserData'] ? localStorage['UserData'] : ''
    if (userData) {
      return JSON.parse(localStorage['UserData']);
    } else {
      return;
    }
  }

  getSchoolAdminSchoolId() {
    let userData = localStorage['UserData'] ? localStorage['UserData'] : ''
    if (userData) {
      return JSON.parse(localStorage['UserData']).schoolid;
    } else {
      return 0;
    }
  }

  getSchoolAdminSchoolName() {
    let userData = localStorage['UserData'] ? localStorage['UserData'] : ''
    if (userData) {
      return JSON.parse(localStorage['UserData']).schoolName;
    } else {
      return '';
    }
  }
}
