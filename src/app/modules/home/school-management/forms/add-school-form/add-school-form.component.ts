import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { distictQuery, getStateAndCityUsingZipCode, getSysGeneratedNcesQuery, schoolValidationQuery } from '../../../../../core/query/school-management';
import { CustomErrorHandlerService } from '../../../../../core/services/custom-error-handler.service';
import { SchoolService } from '../../../../../core/services/school.service';

@Component({
  selector: 'app-add-school-form',
  templateUrl: './add-school-form.component.html',
  styleUrls: ['./add-school-form.component.scss']
})
export class AddSchoolFormComponent implements OnInit {

  addSchoolForm: FormGroup;
  isValidForm = true;
  isSubmitted = false;
  stateList = [] as any;
  filteredDitrict = [] as any;
  tabChangeVal: any;

  selectedSchool: Object = { 'tabchange': Number, 'schoolid': Number };
  bannerSchool: string;
  validations: any;
  isValidZipcode = false;
  isSysGenNces = false;
  sysGenNcesId = '';
  selectedType:string;
  @Input() set formType(value:any){
    this.selectedType = value;
    if(this.addSchoolForm)
      this.updateValidators()

  }

  constructor(
    private readonly _schoolService: SchoolService,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _apollo: Apollo,
  ) { }

  ngOnInit(): void {
    this.validations = this._schoolService.fieldValidations;
    this.addSchoolForm = this._schoolService.getSchoolForm();
    this.updateValidators();
    this.getDistrict();
  }
  updateValidators()
  {
    if(this.selectedType == 'School'){
      
      this.setRequiredValidation('districtName');
      this.setRequiredValidation('schoolProfile');
      this.addSchoolForm.controls['nces'].setValidators(Validators.maxLength(this._schoolService.fieldValidations.ncesId.maxLength));

    }
    else{
      this.removeValidation('districtName');
      this.removeValidation('schoolProfile');
      this.addSchoolForm.controls['nces'].setValidators(Validators.maxLength(this._schoolService.fieldValidations.ipedsId.maxLength));
    }
    this.addSchoolForm.get('nces').updateValueAndValidity();
  }

  getDistrict() {
    this.addSchoolForm.get('districtName').valueChanges.subscribe(
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
              fetchPolicy: 'cache-and-network',
              nextFetchPolicy: 'cache-and-network',
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

  getFieldRef(field: string) {
    return this.addSchoolForm.get(field);
  }

  submit() {
    if (this.addSchoolForm.valid) {
      this._spinner.show();
      if (this.addSchoolForm.get('bannerSchool').value) {
        this.bannerSchool = 'yes';
      } else {
        this.bannerSchool = 'no';
      }
      const body = {
        input:
        {
          'id': 0,
          'schoolName': this.addSchoolForm.get('schoolName').value,
          'countryName': this.addSchoolForm.get('countryName').value,
          'stateName': this.stateList[0]?.value,
          'districtName': this.addSchoolForm.get('districtName').value,
          'cityName': this.addSchoolForm.get('cityName').value,
          'addressFirst': this.addSchoolForm.get('addressFirst').value,
          'addressSecond': this.addSchoolForm.get('addressSecond').value,
          'zipcode': this.addSchoolForm.get('zipcode').value,
          'schoolProfile': this.addSchoolForm.get('schoolProfile').value,
          'nces': this.addSchoolForm.get('nces').value,
          'isSysGenNces': this.isSysGenNces,
          'mainName': '',
          'mainEmail': '',
          'mainPhone': '',
          'banner': this.bannerSchool,
          'emailNotificationStatus': 'yes',
          'validation_mode': 'create',
          'isUniversity':this.selectedType=='School'?0:1

        }

      };
      this._apollo.mutate({
        mutation: schoolValidationQuery,
        variables: body
      }).subscribe(({ data }) => {
        this._spinner.hide();
        this.selectedSchool = { 'tabchange': 1, 'tabDisplay': true, 'schoolDetails': body };
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

  checkIfValidZipCode(event, isValidInput) {
    const zipCode = event.target.value;
    if ((zipCode.length === this.validations.zipCode.maxLength) && isValidInput) {
      this.validateZipCodeOnServer(zipCode);
    } else {
      this.resetStateName();
    }
  }

  resetStateName() {
    this.addSchoolForm.get('stateName').reset();
    this.addSchoolForm.get('stateName').setValue('');
    this.stateList = [];
    this.filteredDitrict = [] as any;
  }

  validateZipCodeOnServer(zipCode) {
    //show loader
    this._spinner.show();
    this._apollo.mutate({
      mutation: getStateAndCityUsingZipCode,
      variables: {
        zip: parseFloat(zipCode)
      }
    }).subscribe(({ data }) => {
      this._spinner.hide();
      const dt = data['getStateAndCityByAdmin'];
      this.isValidZipcode = true;
      this.stateList[0] = { name: dt['state_name'], value: dt['state_id'] };
      //set state & city by zip
      this.getFieldRef('stateName').setValue(dt['state_name']);
      this.getFieldRef('cityName').setValue(dt['city']);
    }, error => {
      this.zipCodeValidationErrorResponse(error);
    });
  }

  zipCodeValidationErrorResponse(error) {
    this._spinner.hide();
    this.isValidZipcode = false;
    this.getFieldRef('zipcode').setErrors({ 'dbError': true });
    this.getFieldRef('zipcode').markAsTouched();
    this._errorHandler.manageError(error);
  }

  generateNcesId() {
    if (!this.sysGenNcesId) {
      this._spinner.show();
      this._apollo
        .query({
          query: getSysGeneratedNcesQuery,
          variables: {
            isUniversity:this.selectedType=='School'?0:1
          },
          fetchPolicy: 'no-cache',
        }).subscribe(({ data }) => {
          this._spinner.hide();
          const dt = data['getSystemGeneratedNcesId'];
          this.sysGenNcesId = dt['nces'];
          this.isSysGenNces = true;
          this.getFieldRef('nces').setValue(this.sysGenNcesId);
        }, error => {
          this.handleNcesApiError(error);
        });
    }
  }

  resetSysGenNcesId() {
    this.isSysGenNces = false;
    this.sysGenNcesId = '';
    this.getFieldRef('nces').reset();
  }

  handleNcesApiError(error) {
    this._spinner.hide();
    this.sysGenNcesId = '';
    this.isSysGenNces = false;
    this._errorHandler.manageError(error, true);
  }
  setRequiredValidation(fieldName) {
    this.addSchoolForm.controls[fieldName].setValidators([Validators.required]);
    this.addSchoolForm.get(fieldName).updateValueAndValidity();
  }

  removeValidation(fieldName) {
    this.addSchoolForm.controls[fieldName].clearValidators();
    this.addSchoolForm.get(fieldName).updateValueAndValidity();
  }

}
