import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CustomErrorHandlerService } from '../../../../../core/services/custom-error-handler.service';
import { SchoolService } from '../../../../../core/services/school.service';
import { removeSpaces } from '../../../../../validators/custom.validator';

const createSchoolQuery = gql`
mutation createSchoolWithAdmin($input:CreateSchoolWithAdminInput!){
  createSchoolWithAdmin(createSchoolWithAdminInput:$input){
    school{
      id
      schoolName
    }
    schoolAdmin{
      id
      schoolid
      email
      name
      phone
    }
  }
}`;
@Component({
  selector: 'app-add-admin-form',
  templateUrl: './add-admin-form.component.html',
  styleUrls: ['./add-admin-form.component.scss']
})
export class AddAdminFormComponent implements OnInit, OnDestroy {

  addAdminForm: FormGroup;
  isValidForm = false;
  isSubmitted = false;
  subscription: Subscription;
  schoolId: any;
  schoolDetails: any;
  constructor(private readonly _schoolService: SchoolService,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _apollo: Apollo,
    private readonly _router: Router,
    private readonly _toastr: ToastrService) {

  }

  ngOnInit(): void {
    this.addAdminForm = new FormGroup({
      'mainName': new FormControl(null, [Validators.required, removeSpaces]),
      'mainEmail': new FormControl(null, [Validators.required, Validators.pattern('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,25})+$'), removeSpaces]),
      'mainPhone': new FormControl(null, [Validators.required, removeSpaces, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]),
    });
    this.getSchoolID();

  }
  getSchoolID() {
    this.subscription = this._schoolService.getMessage().subscribe(message => {
      if (message) {
        this.schoolDetails = message['text']['schoolDetails']['input'];
      }
    });
  }
  getFieldRef(field: string) {
    return this.addAdminForm.get(field);
  }

  submitAddAdminForm() {

    if (this.addAdminForm.valid) {
      this._spinner.show();
      let queryInputs = {
        name: this.getFieldRef('mainName').value,
        phone: this.getFieldRef('mainPhone').value,
        email: this.getFieldRef('mainEmail').value
      };
      queryInputs = Object.assign(queryInputs, this._schoolService.getAdminQueryInput(this.schoolDetails));
      this._apollo.mutate({
        mutation: createSchoolQuery,
        variables: {
          input: queryInputs
        }
      }).subscribe(() => {
        this._schoolService.isDataChange.next(true);
        this._spinner.hide();
        this._toastr.success('School Created Successfully');
        this._router.navigate(['/school-management']);
      }, (error: Error) => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
