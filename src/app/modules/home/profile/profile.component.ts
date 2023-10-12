import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { schoolAdminProfileDetailQuery, soucsAdminProfileDetailQuery } from '../../../core/query/admin';
import { CustomErrorHandlerService } from '../../../core/services/custom-error-handler.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  soucsAdminProfileDetails: any = [];
  schoolAdminProfileDetails: any = [];
  adminType: any;
  constructor(
    private readonly _apollo: Apollo,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _localStorage: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.adminType = this._localStorage.getAdminType();
    this.fetchProfile(this.adminType);
  }

  fetchProfile(adminType) {
    if (adminType === 'SCHOOL_ADMIN') {
      this.getSchoolAdminProfile();
    } else {
      this.getSoucsAdminProfile();
    }
  }

  /**
   * Get SOUCS admin profile details
   */
  getSoucsAdminProfile() {
    this._spinner.show();
    this._apollo
      .query({
        query: soucsAdminProfileDetailQuery,
        variables: {},
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this._spinner.hide();
        this.soucsAdminProfileDetails = data['adminUserProfile'];
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }


  /**
   * Get School admin profile details
   */
  getSchoolAdminProfile() {
    this._spinner.show();
    this._apollo
      .query({
        query: schoolAdminProfileDetailQuery,
        variables: {},
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this._spinner.hide();
        this.schoolAdminProfileDetails = data['getMySchoolAdminDetails'];
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }
}
