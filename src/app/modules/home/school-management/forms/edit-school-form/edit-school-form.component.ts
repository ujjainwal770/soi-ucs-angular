import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { SchoolData } from '../../../../../core/model/school-model';
import { SchoolDetailById, distictQuery, getStateAndCityUsingZipCode, getSysGeneratedNcesQuery, schoolQuery, schoolValidationQuery } from '../../../../../core/query/school-management';
import { CustomErrorHandlerService } from '../../../../../core/services/custom-error-handler.service';
import { HttpService } from '../../../../../core/services/http.service';
import { SchoolService } from '../../../../../core/services/school.service';

@Component({
  selector: 'app-edit-school-form',
  templateUrl: './edit-school-form.component.html',
  styleUrls: ['./edit-school-form.component.scss']
})
export class EditSchoolFormComponent implements OnInit {

  editSchoolForm: FormGroup;
  isValidForm = false;
  isSubmitted = false;
  selectedSchoolId = '';
  zipcodePattern = '/^\d{5}(?:\d{2})?$/';
  schoolList: SchoolData[] = [];
  selectedSchool: {};
  stateList: any = [];
  filteredDitrict = [] as any;
  bannerSchool: string;
  validations: any;
  isValidZipcode = false;
  sysGenNcesId = '';
  isSysGenNces = false;
  selectedType:string;
  @Input() set formType(value:any){
    this.selectedType = value;
    if(this.editSchoolForm)
      this.updateValidators()

  }
  @Output() editSaveChanged = new EventEmitter<boolean>(false);

  constructor(
    private readonly _http: HttpService,
    private readonly _schoolService: SchoolService,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _apollo: Apollo,
    private readonly _activateRouter: ActivatedRoute,
  ) {

  }

  ngOnInit() {
    this.validations = this._schoolService.fieldValidations;
    this.editSchoolForm = this._schoolService.getSchoolForm();
    this.updateValidators();
    this._activateRouter.params.subscribe(params => {
      this.selectedSchoolId = params.id;
    });
    this.getDistrict();
    this.getSchoolByID(this.selectedSchoolId);
    this.editSchoolForm.valueChanges.subscribe(res => {
      if (this.editSchoolForm.dirty) {
        this.editSaveChanged.emit(true);
        this._schoolService.sendMessage({ 'tabDisplay': true });
      }
    });
  }
  updateValidators()
  {
    if(this.selectedType == 'School'){

      this.setRequiredValidation('districtName');
      this.setRequiredValidation('schoolProfile');
      this.editSchoolForm.controls['nces'].setValidators(Validators.maxLength(this._schoolService.fieldValidations.ncesId.maxLength));

    }
    else{
      this.removeValidation('districtName');
      this.removeValidation('schoolProfile');
      this.editSchoolForm.controls['nces'].setValidators(Validators.maxLength(this._schoolService.fieldValidations.ipedsId.maxLength));
    }
    this.editSchoolForm.get('nces').updateValueAndValidity();
  }
  getDistrict() {
    const apiFetchPolicy = 'cache-and-network';
    this.editSchoolForm.get('districtName').setValue('');
    this.editSchoolForm.get('districtName').valueChanges.subscribe(
      term => {
        const stateName = (this.stateList && this.stateList.length > 0) ? this.stateList[0].value : '';
        if (term !== '' && stateName) {
          this._apollo
            .watchQuery({
              query: distictQuery,
              variables: {
                keyword: term,
                state: stateName
              },
              fetchPolicy: apiFetchPolicy,
              nextFetchPolicy: apiFetchPolicy,
              notifyOnNetworkStatusChange: true
            })
            .valueChanges.subscribe(({ data }) => {
              this.filteredDitrict = data as any[];
            }, error => {
              this._errorHandler.manageError(error, true);
            });
        }
      });
  }

  getSchoolByID(id) {
    const apiFetchPolicy = 'cache-and-network';
    this._spinner.show();
    this._apollo
      .query({
        query: SchoolDetailById,
        variables: {
          id: parseFloat(id),
        },
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this.selectedSchool = data['getSchoolDetailById'];
        this.editSchoolForm.patchValue({
          'schoolName': data['getSchoolDetailById'].schoolName,
          'countryName': data['getSchoolDetailById'].countryName,
          'cityName': data['getSchoolDetailById'].cityName,
          'districtName': data['getSchoolDetailById'].districtName,
          'addressFirst': data['getSchoolDetailById'].addressFirst,
          'addressSecond': data['getSchoolDetailById'].addressSecond,
          'zipcode': data['getSchoolDetailById'].zipcode,
          'schoolProfile': data['getSchoolDetailById'].schoolProfile,
          'nces': data['getSchoolDetailById'].nces,
          'bannerSchool': data['getSchoolDetailById'].banner === 'yes' ? true : false,
        });
        this.isSysGenNces = data['getSchoolDetailById'].isSysGenNces;
        this.sysGenNcesId = this.isSysGenNces ? data['getSchoolDetailById'].nces : '';
        this.checkZipCodeOnServer(data['getSchoolDetailById'].zipcode);
        this._spinner.hide();
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }


  getFieldRef(field: string) {
    return this.editSchoolForm.get(field);
  }

  submit() {

    if (this.editSchoolForm.valid) {
      this._spinner.show();
      if (this.editSchoolForm.get('bannerSchool').value) {
        this.bannerSchool = 'yes';
      } else {
        this.bannerSchool = 'no';
      }
      const body = {
        input:
        {
          'id': parseFloat(this.selectedSchoolId),
          'schoolName': this.editSchoolForm.get('schoolName').value,
          'countryName': this.editSchoolForm.get('countryName').value,
          'stateName': this.stateList[0]?.value,
          'districtName': this.editSchoolForm.get('districtName').value,
          'cityName': this.editSchoolForm.get('cityName').value,
          'addressFirst': this.editSchoolForm.get('addressFirst').value,
          'addressSecond': this.editSchoolForm.get('addressSecond').value,
          'zipcode': this.editSchoolForm.get('zipcode').value,
          'schoolProfile': this.editSchoolForm.get('schoolProfile').value,
          'nces': this.editSchoolForm.get('nces').value,
          'isSysGenNces': this.isSysGenNces,
          'mainName': '',
          'mainEmail': '',
          'mainPhone': '',
          'banner': this.bannerSchool,
          'emailNotificationStatus': 'yes',
          'validation_mode': 'update',
          'isUniversity':this.selectedType=='School'?0:1

        }
      };

      this._apollo.mutate({
        mutation: schoolValidationQuery,
        variables: body
      }).subscribe(({ data }) => {
        this._spinner.hide();
        this.selectedSchool = { 'tabchange': 1, 'schoolDetails': body };
        this.sendMessage(this.selectedSchool);
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
    }
  }

  sendMessage(msgObj: Object): void {
    this._schoolService.sendMessage(msgObj);
  }

  checkZipCode(event, isValidInput) {
    const zipCode = event.target.value;
    if ((zipCode.length === this.validations.zipCode.maxLength) && isValidInput) {
      this.checkZipCodeOnServer(zipCode);
    } else {
      this.resetState();
    }
  }

  resetState() {
    this.editSchoolForm.get('stateName').reset();
    this.editSchoolForm.get('stateName').setValue('');
    this.filteredDitrict = [] as any;
    this.stateList = [];
  }

  checkZipCodeOnServer(zipCode) {
    this._spinner.show();
    this._apollo.mutate({
      mutation: getStateAndCityUsingZipCode,
      variables: {
        zip: parseFloat(zipCode)
      }
    }).subscribe(({ data }) => {
      this._spinner.hide();
      this.isValidZipcode = true;
      const dt = data['getStateAndCityByAdmin'];
      this.stateList[0] = { name: dt['state_name'], value: dt['state_id'] };
      this.getFieldRef('stateName').setValue(dt['state_name']);
    }, error => {
      this.zipcodeAPIErrorResponse(error);
    });
  }

  zipcodeAPIErrorResponse(error) {
    this._spinner.hide();
    this.isValidZipcode = false;
    this.editSchoolForm.get('zipcode').setErrors({ 'dbError': true });
    this.editSchoolForm.get('zipcode').markAsTouched();
    this._errorHandler.manageError(error);
  }

  resetSysGenNces() {
    this.isSysGenNces = false;
    this.getFieldRef('nces').reset();
    this.sysGenNcesId = '';
  }

  getSysGeneratedNcesId() {
    if (!this.sysGenNcesId) {
      this._spinner.show();
      this._apollo
        .query({
          query: getSysGeneratedNcesQuery,
          variables: {},
          fetchPolicy: 'no-cache',
        }).subscribe(({ data }) => {
          this._spinner.hide();
          const dt = data['getSystemGeneratedNcesId'];
          this.sysGenNcesId = dt['nces'];
          this.getFieldRef('nces').setValue(this.sysGenNcesId);
          this.isSysGenNces = true;
        }, error => {
          this.onNcesAPIError(error);
        });
    }
  }

  onNcesAPIError(error) {
    this._spinner.hide();
    this.sysGenNcesId = '';
    this.isSysGenNces = false;
    this._errorHandler.manageError(error, true);
  }
  setRequiredValidation(fieldName) {
    this.editSchoolForm.controls[fieldName].setValidators([Validators.required]);
    this.editSchoolForm.get(fieldName).updateValueAndValidity();
  }

  removeValidation(fieldName) {
    this.editSchoolForm.controls[fieldName].clearValidators();
    this.editSchoolForm.get(fieldName).updateValueAndValidity();
  }
}
