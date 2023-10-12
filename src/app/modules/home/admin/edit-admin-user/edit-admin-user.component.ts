import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { getOktaAdminByEmailQuery, roleQuery, updateOktaAdminQuery, updateOktaAdminRoleQuery } from '../../../../core/query/admin';
import { CustomErrorHandlerService } from '../../../../core/services/custom-error-handler.service';

@Component({
  selector: 'app-edit-admin-user',
  templateUrl: './edit-admin-user.component.html',
  styleUrls: ['./edit-admin-user.component.scss']
})
export class EditAdminUserComponent implements OnInit {

  userEmail: string;
  userDetails: any;
  editAdminFormGroup: FormGroup;
  roles = [];
  constructor(
    private readonly _router: Router,
    private readonly _apollo: Apollo,
    private readonly _spinner: NgxSpinnerService,
    private readonly _toastr: ToastrService,
    private readonly _activateRouter: ActivatedRoute,
    private readonly _errorHandler: CustomErrorHandlerService
  ) { }

  ngOnInit(): void {
    this._activateRouter.params.subscribe(params => {
      this.userEmail = params.id;
      this.getUserDetailByEmail();
    });
    this.initForm();
    this.fetchRoles();
  }

  initForm() {
    this.editAdminFormGroup = new FormGroup({
      'firstName': new FormControl('', [Validators.required]),
      'lastName': new FormControl('', [Validators.required]),
      'email': new FormControl('', [Validators.required, Validators.pattern('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,25})+$')]),
      'mobile': new FormControl('', [Validators.required]),
      'roleName': new FormControl('', [Validators.required])
    });
  }

  getUserDetailByEmail() {
    this._spinner.show();
    this._apollo
      .query({
        query: getOktaAdminByEmailQuery,
        variables: {
          email: this.userEmail
        },
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this._spinner.hide();
        this.userDetails = data['getOktaAdminByEmail'];
        this.getFieldR('firstName').setValue(this.userDetails?.firstName);
        this.getFieldR('lastName').setValue(this.userDetails?.lastName);
        this.getFieldR('email').setValue(this.userDetails?.email);
        this.getFieldR('mobile').setValue(this.userDetails?.mobilePhone);
        this.getFieldR('roleName').setValue(this.userDetails?.roleName);
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  /**
   * @param name of the reactive form control
   * @returns detail of reactive form control
   */
   getFieldR(name: string) {
    return this.editAdminFormGroup.get(name);
  }

  fetchRoles() {
    this._apollo
      .query({
        query: roleQuery,
        variables: {},
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this.roles = data['role'];
      }, error => {
        this._errorHandler.manageError(error, true);
      });
  }

  //For now this funciton is not in use.
  updateUser() {
    if (this.editAdminFormGroup.valid) {
      this._spinner.show();
      this.updateRole();
      this._apollo.mutate({
        mutation: updateOktaAdminQuery,
        variables: {
          firstName: this.editAdminFormGroup.value.firstName,
          lastName: this.editAdminFormGroup.value.lastName,
          email: this.editAdminFormGroup.value.email,
          mobilePhone: this.editAdminFormGroup.value.mobile
        }
      }).subscribe(({ data }) => {
        this._spinner.hide();
        this._toastr.success('User detail has been updated successfully');
        this.gotoAdminList();
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
    } else {
      this.editAdminFormGroup.markAllAsTouched();
    }
  }

  updateRole() {
    this._spinner.show();
      this._apollo.mutate({
        mutation: updateOktaAdminRoleQuery,
        variables: {
          email: this.editAdminFormGroup.value.email,
          roleName: this.editAdminFormGroup.value.roleName
        }
      }).subscribe(({ data }) => {
        this._spinner.hide();
        this._toastr.success('Role has been updated');
        this.gotoAdminList();
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error);
      });
  }

  gotoAdminList() {
    this.initForm();
    this._router.navigateByUrl('/admin/admin-list');
  }
}
