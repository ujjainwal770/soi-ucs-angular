import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CustomErrorHandlerService {

  constructor(
    private readonly _toastr: ToastrService,
    private readonly _router: Router,
    private readonly _localStorage: LocalStorageService
  ) { }

  manageError(error, isShowToasterMsg: Boolean = false) {
    // let errorTitle = error['graphQLErrors'][0]?.message;
    let errorTitle = '';
    let errorDetail = '';
    let errorStatus;
    if (error?.graphQLErrors?.length > 0) {
      errorStatus = error.graphQLErrors[0]?.status;
      if (error.graphQLErrors[0]?.error?.length > 0) {
        let errorMsg = JSON.stringify(error.graphQLErrors[0].error);

        // check if first and last character is an array symbol.
        if (errorMsg.slice(0, 1) === '[' && errorMsg.slice(-1) === ']') {
          errorDetail = error.graphQLErrors[0].error[0];
        } else {
          errorDetail = error.graphQLErrors[0].error;
        }
        if (errorDetail?.toLowerCase()?.indexOf('forbidden') >= 0 || errorDetail?.toLowerCase() === 'unauthorized') {
          errorDetail = '';
        }
      }
    }

    if (isShowToasterMsg && errorDetail) {
      this._toastr.error(errorDetail, errorTitle);
    }

    if (errorStatus === 401 || errorStatus === 403) {
      this._localStorage.removeAll();
      this._router.navigateByUrl('/auth/home');
    }
  }
}
