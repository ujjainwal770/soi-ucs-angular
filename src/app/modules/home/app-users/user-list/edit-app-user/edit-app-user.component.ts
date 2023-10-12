import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { _CONST } from '../../../../../core/constants/app.constants';
import { findSchoolsByStateQuery, saveUserDetailQuery, userDetailsQuery } from '../../../../../core/query/appuser';
import { getStateList } from '../../../../../core/query/report-download';
import { getStateAndCityUsingZipCode } from '../../../../../core/query/school-management';
import { CustomErrorHandlerService } from '../../../../../core/services/custom-error-handler.service';
import { DialogsService } from '../../../../../core/services/dialog-service';
import { ConvertToLocalDatePipe } from 'src/app/core/pipe/convert-to-local-date.pipe';

@Component({
  selector: 'app-edit-app-user',
  templateUrl: './edit-app-user.component.html',
  styleUrls: ['./edit-app-user.component.scss']
})

export class EditAppUserComponent implements OnInit {

  editUserForm: FormGroup;
  userId = _CONST.zero;
  userData: any = {};
  // mapped dyanamically for the html purpose i.e. ucs / non ucs user state
  stateList: any = [];
  // only contains the ucs user state list and fetched only once while loading the public user data
  ucsStateList: any = [];
  schoolList: any = [];
  isUcsUser = false;
  maxDate: Date = new Date();
  // Minimum 13 years old allowed as DOB
  minYearOld: Date = new Date();
  ConvertToLocalDate = new ConvertToLocalDatePipe()

  constructor(
    private readonly _dialogsService: DialogsService,
    private readonly _activateRouter: ActivatedRoute,
    private readonly _router: Router,
    private readonly _apollo: Apollo,
    private readonly _toastr: ToastrService,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this._activateRouter.params.subscribe(params => {
      this.userId = params.id ? parseFloat(params.id) : _CONST.zero;
      this.getAppUserDetails();
    });
    this.maxDate.setFullYear(new Date().getFullYear() - _CONST.minAge);
    this.minYearOld.setFullYear(new Date().getFullYear() - _CONST.maxAge);

  }

  initForm() {
    this.editUserForm = new FormGroup({
      'firstName': new FormControl('', [Validators.required]),
      'lastName': new FormControl('', [Validators.required]),
      'dob': new FormControl('', [Validators.required]),
      'email': new FormControl('', [Validators.required]),
      'userType': new FormControl('', [Validators.required]),
      'registeredOn': new FormControl('', [Validators.required]),
      'accountStatus': new FormControl('', [Validators.required]),
      'noOfBadgeEarned': new FormControl('', [Validators.required]),
      'totalPoints': new FormControl('', [Validators.required]),
      'noOfInclusionPlayed': new FormControl('', [Validators.required]),
      'recentInclusionResult': new FormControl('', [Validators.required]),
      'stateName': new FormControl('', [Validators.required]),
      'zipCode': new FormControl('', [Validators.required]),
      'cityName': new FormControl('', [Validators.required]),
      'country': new FormControl('', [Validators.required]),
      'schoolId': new FormControl('', [Validators.required]),
      'nces': new FormControl('', [Validators.required])
    });
  }
  getTimestamp(date) {
    return new Date(date).setHours(0, 0, 0, 0) + (((new Date().getTimezoneOffset()) * (1000 * 60)) * -1)
  }
  autoPopulateData() {
    this.schoolList = [{ id: this.userData.school_id, schoolName: this.userData.schoolName }];
    this.isUcsUser = (this.userData.ucs_status === 'yes');
    this.updateLocationValidation();
    this.editUserForm.patchValue({
      'firstName': this.userData.first_name,
      'lastName': this.userData.last_name,
      'dob': this.userData.date_of_birth !== 0 ? new Date(this.ConvertToLocalDate.transform(this.userData.date_of_birth)):null,
      'email': this.userData.email,
      'registeredOn': this.userData.creation_time ? formatDate(this.userData.creation_time, 'MM/dd/y', 'en-US') : '',
      'accountStatus': this.userData.account_status === 'deactivated' ? 'Inactive' : 'Active',
      'noOfBadgeEarned': this.userData.totalbadge,
      'totalPoints': this.userData.totalpoints,
      'noOfInclusionPlayed': this.userData.inclusioncount,
      'recentInclusionResult': this.userData.inclusionResult || 'N/A',
      'country': 'USA',
      'schoolId': this.userData.school_id,
      'nces': this.userData.nces,
    });

    if (this.isUcsUser) {
      this.editUserForm.patchValue({
        'userType': 'ucs',
        'stateName': this.userData.schoolStateAbbreviation,
        'zipCode': this.userData.schoolZipcode,
        'cityName': this.userData.schoolCityName
      });
      this.fetchUcsStateList();
    } else {
      this.editUserForm.patchValue({
        'userType': 'public',
        'stateName': this.userData.stateAbbreviation,
        'zipCode': this.userData.zipcode,
        'cityName': this.userData.cityName,
      });

      if (this.userData.stateName) {
        this.stateList = [{ name: this.userData.stateName, abbreviation: this.userData.stateAbbreviation }];
      } else {
        this.stateList = [];
      }
    }
  }

  getFieldRef(field: string) {
    return this.editUserForm.get(field);
  }

  updateLocationValidation() {
    const controls = ['stateName', 'zipCode', 'cityName'];
    for (const key of controls) {
      if (this.isUcsUser) {
        this.editUserForm.controls[key].setValidators([Validators.required]);
      } else {
        this.editUserForm.controls[key].clearValidators();
      }
      this.editUserForm.get(key).updateValueAndValidity();
    }
  }

  getAppUserDetails() {
    this._spinner.show();
    this._apollo
      .query({
        query: userDetailsQuery,
        variables: {
          id: this.userId
        },
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this._spinner.hide();
        this.userData = data['getUserViewDetail'];
        this.autoPopulateData();
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  onUserTypeChanged() {
    const pgtitle = 'Confirm';
    let message = 'Are you sure you want to deregister this user from ';
    const userTypeValue = this.getFieldRef('userType').value;
    message += userTypeValue == 'ucs' ? 'public to UCS?' : 'UCS to Public?';
    this._dialogsService
      .confirmationDialogPopUp(pgtitle, message)
      .subscribe(res => {
        if (res) {
          this.isUcsUser = userTypeValue === 'ucs';
          this.updateLocationValidation();
          if (this.isUcsUser) {
            this.fetchUcsStateList();
            if (this.userData.schoolStateAbbreviation) {
              const userData = this.userData;
              this.schoolList = [{ id: userData.school_id, schoolName: userData.schoolName }];
              const fieldRef = this.getFieldRef.bind(this);
              fieldRef('stateName').setValue(userData.schoolStateAbbreviation);
              fieldRef('zipCode').setValue(userData.schoolZipcode);
              fieldRef('cityName').setValue(userData.schoolCityName);
              fieldRef('schoolId').setValue(userData.school_id);
              fieldRef('nces').setValue(userData.nces);
            } else {
              this.resetUcsSpecificFields();
            }
          } else {
            this.resetPublicSpecificFields();
          }
        } else {
          // No change in user type if select no from the dialog.
          this.getFieldRef('userType').setValue(this.isUcsUser ? 'ucs' : 'public');
        }
      });
  }
  // Fetch all state list.
  fetchUcsStateList() {
    if (this.ucsStateList.length === 0) {
      this._spinner.show();
      this._apollo.query({
        query: getStateList,
        variables: {
          countryname: ''
        },
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this._spinner.hide();
        this.ucsStateList = data['getStateList']['state'];
        this.stateList = this.ucsStateList;
        if (this.getFieldRef('stateName').value) {
          this.fetchSchoolByState();
        }
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
    } else {
      this.stateList = this.ucsStateList;
    }
  }

  // reset the fields applicable for ucs user
  resetUcsSpecificFields() {
    this.getFieldRef('schoolId').reset();
    this.getFieldRef('zipCode').reset();
    this.getFieldRef('cityName').reset();
    this.getFieldRef('nces').reset();
  }

  // reset the fields applicable for public user
  resetPublicSpecificFields() {
    this.stateList = [];
    this.getFieldRef('zipCode').reset();
    this.getFieldRef('stateName').reset();
    this.getFieldRef('cityName').reset();
  }

  // Fetch all state list used in case of ucs user.
  fetchSchoolByState() {
    this._spinner.show();
    this._apollo.query({
      query: findSchoolsByStateQuery,
      variables: {
        statename: this.getFieldRef('stateName').value,
      },
      fetchPolicy: 'no-cache'
    }).subscribe(({ data }) => {
      this._spinner.hide();
      this.schoolList = data['findSchoolsByState'];
    }, error => {
      this._spinner.hide();
      this._errorHandler.manageError(error, true);
    });
  }

  // get the state and city based on the provided zip code
  getStateAndCityByZip() {
    const zipCode = this.getFieldRef('zipCode').value;
    if (this.getFieldRef('zipCode').valid && this.getFieldRef('zipCode').value.length === _CONST.five) {
      this._spinner.show();
      this._apollo.mutate({
        mutation: getStateAndCityUsingZipCode,
        variables: {
          zip: parseFloat(zipCode)
        }
      }).subscribe(({ data }) => {
        this._spinner.hide();
        const dt = data['getStateAndCityByAdmin'];
        this.stateList = [{ name: dt['state_name'], abbreviation: dt['state_id'] }];
        this.getFieldRef('stateName').setValue(dt['state_id']);
        this.getFieldRef('cityName').setValue(dt['city']);
      }, error => {
        this._spinner.hide();
        this.getFieldRef('zipCode').setErrors({ 'dbError': true });
        this._errorHandler.manageError(error);
      });
    } else {
      this.getFieldRef('zipCode').markAsTouched();
      this.getFieldRef('stateName').reset();
      this.getFieldRef('cityName').reset();
      this.stateList = [];
    }
  }

  // Function called when the school is changed from the ui
  onSchoolChange() {
    const schoolId = this.getFieldRef('schoolId').value;
    const schoolDetail = this.schoolList.find(item => item.id === schoolId);
    this.getFieldRef('zipCode').setValue(schoolDetail.zipcode);
    this.getFieldRef('cityName').setValue(schoolDetail.cityName);
    this.getFieldRef('nces').setValue(schoolDetail.nces);
  }

  // get the extra inputs for the ucs user
  getUcsSpecificInputs() {
    this.editUserForm.controls['nces'].setValidators([Validators.required]);
    this.editUserForm.get('nces').updateValueAndValidity();
    return {
      ucs_status: 'yes',
      school_id: this.getFieldRef('schoolId').value
    };
  }

  // get the extra inputs for the public user
  getNonUcsSpecificInputs() {
    this.editUserForm.controls['nces'].clearValidators();
    this.editUserForm.get('nces').updateValueAndValidity();
    return {
      ucs_status: 'no',
      zipcode: this.getFieldRef('zipCode').value,
      stateName: this.getFieldRef('stateName').value,
      cityName: this.getFieldRef('cityName').value
    };
  }

  // Get extra inputs as per the user type for the query
  userTypeSpecificInputs() {
    return this.isUcsUser ?
      this.getUcsSpecificInputs() :
      this.getNonUcsSpecificInputs();
  }

  // update the user details
  save() {
    const varInputs = {
      user_id: this.userId,
      first_name: this.getFieldRef('firstName').value,
      last_name: this.getFieldRef('lastName').value,
      date_of_birth: this.getTimestamp(this.getFieldRef('dob').value),
      ...this.userTypeSpecificInputs()
    };

    if (this.editUserForm.valid) {
      this._spinner.show();
      this._apollo.mutate({
        mutation: saveUserDetailQuery,
        variables: varInputs
      }).subscribe(({ data }) => {
        this._spinner.hide();
        this._toastr.success('User detail has been changed successfully');
        this._router.navigateByUrl('/app-users/user-list');
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
    } else {
      this.editUserForm.markAllAsTouched();
    }
  }
}
