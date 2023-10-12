import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SchoolData } from '../../../../core/model/school-model';
import { SchoolDetailById, getStateAndCityUsingZipCode, resendInviteLinkQuery } from '../../../../core/query/school-management';
import { CustomErrorHandlerService } from '../../../../core/services/custom-error-handler.service';
import { DialogsService } from '../../../../core/services/dialog-service';
import { _CONST } from '../../../../core/constants/app.constants';

const getAdminQuey = gql`
query($id:Int!){
  findAllSchoolAdmins(schoolid:$id){
    id,
    schoolid
    name,
    email,
    phone,
    verificationstatus
  }
 }`;
@Component({
  selector: 'app-school-view',
  templateUrl: './school-view.component.html',
  styleUrls: ['./school-view.component.scss']
})
export class SchoolViewComponent implements OnInit {

  schoolList: SchoolData[] = [];
  selectedSchool: any = {};
  selectedSchoolId = '';
  schoolDetails = {};
  adminInfo = {};
  isValidZipCode = true;
  isResendLinkSent = false;
  isEditable = false;
  // Resend the invitation link after 30 seconds.
  timeLeft = _CONST.RESEND_INVITATION_DELAY_SEC;
  isUniversity = 0;

  constructor(
    private readonly _apollo: Apollo,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _toastr: ToastrService,
    private readonly _dialogsService: DialogsService,
    private readonly _router: Router,
    private readonly _activateRouter: ActivatedRoute) { }

  ngOnInit() {
    this._activateRouter.params.subscribe(params => {
      this.selectedSchoolId = params.id;
    });
    this.getSchoolByID(this.selectedSchoolId);
    this.getAdminData(this.selectedSchoolId);
  }

  getAdminData(id) {
    this._spinner.show();
    this._apollo
      .query({
        query: getAdminQuey,
        variables: {
          id: parseInt(id),
        },
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this._spinner.hide();
        if (data['findAllSchoolAdmins'].length) {
          this.adminInfo = data['findAllSchoolAdmins'][0];
        }
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  getSchoolByID(id) {
    this._spinner.show();
    this._apollo
      .query({
        query: SchoolDetailById,
        variables: {
          id: parseFloat(id),
        },
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this._spinner.hide();
        this.selectedSchool = data['getSchoolDetailById'];
        this.isUniversity = this.selectedSchool?.isUniversity;
        this.checkZipCodeValidity(this.selectedSchool.zipcode);
        this.isEditable = (this.selectedSchool?.status === 'active');
      }, error => {
        this.isEditable = false;
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }
  gotoSchoolEdit() {
    this._router.navigateByUrl(`/school-management/school-edit/${this.selectedSchoolId}`);
  }

  checkZipCodeValidity(zipCode) {
    this._spinner.show();
    this._apollo.mutate({
      mutation: getStateAndCityUsingZipCode,
      variables: {
        zip: parseFloat(zipCode)
      }
    }).subscribe(({ data }) => {
      this._spinner.hide();
      this.isValidZipCode = true;
    }, error => {
      this.zipCodeErrorResponse(error);
    });
  }

  zipCodeErrorResponse(error) {
    this._spinner.hide();
    this.isValidZipCode = false;
    this._errorHandler.manageError(error);
  }

  resendLink() {
    this._spinner.show();
    this._apollo.mutate({
      mutation: resendInviteLinkQuery,
      variables: {
        schoolId: parseFloat(this.selectedSchoolId)
      }
    }).subscribe(({ data }) => {
      this._spinner.hide();
      this.isResendLinkSent = true;
      this._toastr.success('Invitation mail has been sent successfully.');
      this.startTimer();
    }, error => {
      this._spinner.hide();
      this._errorHandler.manageError(error, true);
    });
  }

  startTimer() {
    const interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(interval);
        this.isResendLinkSent = false;
        this.timeLeft = _CONST.RESEND_INVITATION_DELAY_SEC;
      }
    }, _CONST.milliSeconds);
  }

  confirmationDialog() {
    const pgtitle = 'Confirm';
    const message = `Are you sure want to resend the invite?`;

    this._dialogsService
      .confirmationDialogPopUp(pgtitle, message)
      .subscribe(res => {
        if (res) {
          this.resendLink();
        }
      });
  }
}
