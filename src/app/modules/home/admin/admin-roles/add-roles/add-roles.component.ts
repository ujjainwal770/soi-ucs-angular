import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { _CONST } from '../../../../../core/constants/app.constants';
import { CustomErrorHandlerService } from '../../../../../core/services/custom-error-handler.service';
import { addAdminRoleQuery } from '../../../../../core/query/admin-role';

@Component({
  selector: 'app-add-roles',
  templateUrl: './add-roles.component.html',
  styleUrls: ['./add-roles.component.scss']
})
export class AddRolesComponent implements OnInit {

  newAdminFormGroup: FormGroup;
  roles: any = [];
  displayedColumns: string[] = ['feature', 'view', 'addedit', 'delete'];
  dataSource = new MatTableDataSource<any>();
  pageSizes = _CONST['defaultPageSizeArray'];
  pageSizeCount: number;
  count = 0;
  currentPage = _CONST.zero;
  nextPage: number;
  DASHBOARD_CONSTANT_INDEX = _CONST.zero;
  SCHOOL_CONSTANT_INDEX = _CONST.one;
  CONTENT_TAGS_CONSTANT_INDEX = _CONST.two;
  CONTENT_CHALLENGE_CONSTANT_INDEX = _CONST.three;
  ADMIN_ROLE_CONSTANT_INDEX = _CONST.five;

  roleType = [
    {
      feature: 'Dasboard',
      view: 'no',
      addedit: 'no',
      delete: 'no'
    },
    {
      feature: 'School',
      view: 'no',
      addedit: 'no',
      delete: 'no'
    },
    {
      feature: 'Content: Manage Tags',
      view: 'no',
      addedit: 'no',
      delete: 'no'
    },
    {
      feature: 'Content: Challenge Abuse',
      view: 'no',
      addedit: 'no',
      delete: 'no'
    },
    {
      feature: 'Admin: Admin List',
      view: 'no',
      addedit: 'no',
      delete: 'no'
    },
    {
      feature: 'Admin: Admin Role',
      view: 'no',
      addedit: 'no',
      delete: 'no'
    }
  ];

  constructor(
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _apollo: Apollo,
    private readonly toastr: ToastrService,
    private readonly _router: Router,
  ) { }

  ngOnInit(): void {
    this.newAdminFormGroup = new FormGroup({
      'name': new FormControl('', [Validators.required]),
      'description': new FormControl('')
    });
    this.roles = ['Content Manager'];
    this.dataSource = new MatTableDataSource(this.roleType);
  }

  setUserAccess(isChecked: any, ele: any, type: string) {
    this.roleType.forEach(item => {
      if (item.feature === ele.feature) {
        switch (type) {
          case 'view':
            item.view = isChecked ? 'yes' : 'no';
            break;
          case 'addedit':
            item.addedit = isChecked ? 'yes' : 'no';
            break;
          case 'delete':
            item.delete = isChecked ? 'yes' : 'no';
            break;
          default:
            break;
        }
      }
    });
  }

  submit() {
    if (this.newAdminFormGroup.valid) {
      this._spinner.show();
      const body = {
        roleName: this.newAdminFormGroup.get('name').value,
        contentView: this.roleType[this.CONTENT_TAGS_CONSTANT_INDEX].view,
        contentUpdate: this.roleType[this.CONTENT_TAGS_CONSTANT_INDEX].addedit,
        contentDelete: this.roleType[this.CONTENT_TAGS_CONSTANT_INDEX].delete,
        adminlistView: this.roleType[this.CONTENT_TAGS_CONSTANT_INDEX].view,
        adminlistUpdate: this.roleType[this.CONTENT_TAGS_CONSTANT_INDEX].addedit,
        adminlistDelete: this.roleType[this.CONTENT_TAGS_CONSTANT_INDEX].delete,
        schoolView: this.roleType[this.SCHOOL_CONSTANT_INDEX].view,
        schoolUpdate: this.roleType[this.SCHOOL_CONSTANT_INDEX].addedit,
        schoolDelete: this.roleType[this.SCHOOL_CONSTANT_INDEX].delete,
        abuseView: this.roleType[this.CONTENT_CHALLENGE_CONSTANT_INDEX].view,
        abuseUpdate: this.roleType[this.CONTENT_CHALLENGE_CONSTANT_INDEX].addedit,
        abuseDelete: this.roleType[this.CONTENT_CHALLENGE_CONSTANT_INDEX].delete,
        dashboardView: this.roleType[this.DASHBOARD_CONSTANT_INDEX].view,
        roleView: this.roleType[this.ADMIN_ROLE_CONSTANT_INDEX].view,
        roleUpdate: this.roleType[this.ADMIN_ROLE_CONSTANT_INDEX].view,
        roleDelete: this.roleType[this.ADMIN_ROLE_CONSTANT_INDEX].view,
      };

      this._apollo.mutate({
        mutation: addAdminRoleQuery,
        variables: body
      }).subscribe(({ data }) => {
        this._spinner.hide();
        this.toastr.success('Role Saved successfully');
        this._router.navigateByUrl('/admin/admin-roles');
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
    }
  }
}
