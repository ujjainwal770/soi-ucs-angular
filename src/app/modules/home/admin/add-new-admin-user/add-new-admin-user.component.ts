import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { addOktaAdminQuery, roleQuery } from '../../../../core/query/admin';
import { CustomErrorHandlerService } from '../../../../core/services/custom-error-handler.service';

@Component({
  selector: 'app-add-new-admin-user',
  templateUrl: './add-new-admin-user.component.html',
  styleUrls: ['./add-new-admin-user.component.scss']
})
export class AddNewAdminUserComponent implements OnInit {

  newAdminFormGroup: FormGroup;
  roles = [];
  constructor(
    private readonly _router: Router,
    private readonly _apollo: Apollo,
    private readonly _spinner: NgxSpinnerService,
    private readonly _toastr: ToastrService,
    private readonly _errorHandler: CustomErrorHandlerService
  ) { }

  ngOnInit(): void {
    this.newAdminFormGroup = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.pattern('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,25})+$')]),
      'roleName': new FormControl('', [Validators.required])
    });
    this.fetchRoles();
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

  gotoAdminList() {
    this._router.navigateByUrl('/admin/admin-list');
  }

  /**
   * @param name of the reactive form control
   * @returns detail of reactive form control
   */
  getFieldR(name: string) {
    return this.newAdminFormGroup.get(name);
  }

  submit() {
    if (this.newAdminFormGroup.valid) {
      this._spinner.show();
      this._apollo.mutate({
        mutation: addOktaAdminQuery,
        variables: {
          email: this.newAdminFormGroup.value.email,
          roleName: this.newAdminFormGroup.value.roleName
        }
      }).subscribe(({ data }) => {
        this._spinner.hide();
        this._toastr.success('New user has been added successfully');
        this.gotoAdminList();
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
    } else {
      this.newAdminFormGroup.markAllAsTouched();
    }
  }

}
