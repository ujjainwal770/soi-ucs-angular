import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SchoolService } from '../../../../core/services/school.service';
import { EditAdminFormComponent } from '../forms/edit-admin-form/edit-admin-form.component';
import gql from 'graphql-tag';
import { NgxSpinnerService } from 'ngx-spinner';
import { Apollo } from 'apollo-angular';
import { CustomErrorHandlerService } from 'src/app/core/services/custom-error-handler.service';
export const schoolQuery = gql`query($id:Float!){
  findById(id:$id){
    id,
    isUniversity
  }
}`;
@Component({
  selector: 'app-school-edit',
  templateUrl: './school-edit.component.html',
  styleUrls: ['./school-edit.component.scss']
})
export class SchoolEditComponent {
  subscription: Subscription;
  disableTab = false;
  public editTabIndex = 0;
  isEditSaved = false;
  selectedType: any = "School";

  @ViewChild(EditAdminFormComponent) child: EditAdminFormComponent;

  constructor(private readonly _schoolService: SchoolService,
    private readonly toastr: ToastrService,
    private readonly _spinner: NgxSpinnerService,
    private readonly _apollo: Apollo,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _router: Router,
    private readonly _activateRouter: ActivatedRoute,) {
      this._activateRouter.params.subscribe(params => {
        this.getSchoolByID(params.id)
      });
      
    this.subscription = this._schoolService.getMessage().subscribe(message => {
      this.editTabIndex = message['text']['tabchange'];
      this.disableTab = message['text']['tabDisplay'];
    });
  }

  backclicked() {
    this._router.navigate(['/school-management']);
  }

  checkEditChange(event) {
    this.isEditSaved = event;
  }
  getSchoolByID(id) {
    const apiFetchPolicy = 'cache-and-network';
    this._spinner.show();
    this._apollo
      .watchQuery({
        query: schoolQuery,
        variables: {
          id: parseFloat(id),
        },
        fetchPolicy: apiFetchPolicy,
        nextFetchPolicy: apiFetchPolicy,
        notifyOnNetworkStatusChange: true,
      }).valueChanges.subscribe(({ data }) => {
       this.selectedType = data["findById"].isUniversity==1?"University":"School";
        this._spinner.hide();
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  // onTabChanged (event: any) {
  //   if(event.tab.origin === 1) {
  //     this.child.checkDataChange(this.isEditSaved);
  //   }
  // }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
