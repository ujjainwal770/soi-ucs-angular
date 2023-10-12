import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CustomErrorHandlerService } from '../../../../../core/services/custom-error-handler.service';
import { SchoolService } from '../../../../../core/services/school.service';
import { removeSpaces } from '../../../../../validators/custom.validator';


const updateAdminQuery = gql`
mutation updateSchoolWithAdmin($input:UpdateSchoolWithAdminInput!){
  updateSchoolWithAdmin(updateSchoolWithAdminInput:$input){
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
  selector: 'app-edit-admin-form',
  templateUrl: './edit-admin-form.component.html',
  styleUrls: ['./edit-admin-form.component.scss']
})

export class EditAdminFormComponent implements OnInit {

  editAdminForm: FormGroup;
  isValidForm = false;
  isSubmitted = false;
  selectedSchoolId: any;
  adminInfo: any = {};

  @Input('isEditSaved') isEditSaved;
  subscription: any;
  schoolDetails: any;
  constructor(
    private readonly _schoolService: SchoolService,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _apollo: Apollo,
    private readonly _router: Router,
    private readonly toastr: ToastrService,
    private readonly _activateRouter: ActivatedRoute,
  ) {
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.initForm();
    this._activateRouter.params.subscribe(params => {
      this.selectedSchoolId = params.id;
    });

    this.getAdminData(this.selectedSchoolId);
    this.subscription = this._schoolService.getMessage().subscribe(message => {
      if (message) {
        this.schoolDetails = message['text']['schoolDetails']?.input;
      }
    });
  }

  initForm() {
    this.editAdminForm = new FormGroup({
      'mainName': new FormControl(null, [Validators.required, removeSpaces]),
      'mainEmail': new FormControl(null, [Validators.required, Validators.pattern('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,25})+$'), removeSpaces]),
      'mainPhone': new FormControl(null, [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'), removeSpaces]),
    });
  }

  getAdminData(id) {

    this._apollo
      .watchQuery({
        query: getAdminQuey,
        variables: {
          id: parseInt(id),
        },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
      }).valueChanges.subscribe(({ data }) => {
        if (data['findAllSchoolAdmins'].length) {
          this.editAdminForm.patchValue({
            mainName: data['findAllSchoolAdmins'][0].name,
            mainEmail: data['findAllSchoolAdmins'][0].email,
            mainPhone: data['findAllSchoolAdmins'][0]['phone'],
          });
          this.adminInfo = data['findAllSchoolAdmins'][0];

        }
      }, error => {
        this._errorHandler.manageError(error, true);
      });
  }
  getFieldRef(field: string) {
    return this.editAdminForm.get(field);
  }

  submit() {

    if (this.editAdminForm.valid) {
      this._spinner.show();
      let inputs = {
        id: parseFloat(this.selectedSchoolId),
        adminid: parseFloat(this.adminInfo['id']),
        name: this.getFieldRef('mainName').value,
        phone: this.getFieldRef('mainPhone').value,
        email: this.getFieldRef('mainEmail').value
      };

      inputs = Object.assign(inputs, this._schoolService.getAdminQueryInput(this.schoolDetails));
      this._apollo.mutate({
        mutation: updateAdminQuery,
        variables: {
          input: inputs
        }
      }).subscribe(() => {
        this._spinner.hide();
        this.toastr.success('Admin Updated Successfully');
        this._router.navigate(['/school-management']);
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
    }
  }

  patchValue(data) {
    this.editAdminForm.patchValue({
      mainName: data['name'],
      mainEmail: data['email'],
      mainPhone: data['phone'],
    });
  }
}
