import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { isNumericOnly, removeSpaces } from 'src/app/validators/custom.validator';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {

  public isDataChange = new BehaviorSubject<boolean>(false);
  private subject = new Subject<any>();

  public isSchoolEditChange = new BehaviorSubject<boolean>(false);

  // School: - add / edit form group validations
  public fieldValidations = {
    schoolName: { maxLength: 100 },
    ncesId: { minLength: 12, maxLength: 12 },
    ipedsId: { minLength: 6, maxLength: 6 },
    districtName: { maxLength: 100 },
    addressFirst: { maxLength: 100 },
    addressSecond: { maxLength: 100 },
    cityName: { maxLength: 50 },
    mainPhone: { maxLength: 10 },
    zipCode: { pattern: '^[0-9]{5,5}$', maxLength: 5 }
  };

  constructor() { }

  sendMessage(message: Object) {
    this.subject.next({ text: message });
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  // School: - add / edit form group
  getSchoolForm() {
    let schoolForm = new FormGroup({
      'schoolName': new FormControl(null, [Validators.required, Validators.maxLength(this.fieldValidations.schoolName.maxLength), removeSpaces]),
      'countryName': new FormControl('USA', [Validators.required]),
      'stateName': new FormControl('', [Validators.required]),
      'districtName': new FormControl(null, [Validators.required, Validators.maxLength(this.fieldValidations.districtName.maxLength)]),
      'cityName': new FormControl(null, [Validators.required, Validators.maxLength(this.fieldValidations.cityName.maxLength), removeSpaces]),
      'addressFirst': new FormControl('', [Validators.required, Validators.maxLength(this.fieldValidations.addressFirst.maxLength), removeSpaces]),
      'addressSecond': new FormControl('', [Validators.maxLength(this.fieldValidations.addressSecond.maxLength), removeSpaces]),
      'zipcode': new FormControl(null, [Validators.required, Validators.pattern(this.fieldValidations.zipCode.pattern), removeSpaces]),
      'schoolProfile': new FormControl('', [Validators.required]),
      'nces': new FormControl('', [Validators.maxLength(this.fieldValidations.ncesId.maxLength)]),
      'bannerSchool': new FormControl(false),
      'mainName': new FormControl(''),
      'mainEmail': new FormControl(''),
      'mainPhone': new FormControl(''),
    });
    return schoolForm;
  }

  getAdminQueryInput(schoolDetails: any) {
    let input = {
      schoolName: schoolDetails?.schoolName,
      countryName: schoolDetails?.countryName,
      stateName: schoolDetails?.stateName,
      districtName: schoolDetails?.districtName,
      cityName: schoolDetails?.cityName,
      addressFirst: schoolDetails?.addressFirst,
      addressSecond: schoolDetails?.addressSecond,
      zipcode: schoolDetails?.zipcode,
      schoolProfile: schoolDetails?.schoolProfile,
      nces: schoolDetails?.nces,
      isSysGenNces: schoolDetails?.isSysGenNces,
      'mainName': '',
      'mainEmail': '',
      'mainPhone': '',
      banner: schoolDetails?.banner,
      'emailNotificationStatus': 'yes',
      'isUniversity':schoolDetails?.isUniversity,

    }
    return input
  }

}
