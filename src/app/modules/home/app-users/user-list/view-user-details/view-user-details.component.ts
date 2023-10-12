import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { userDetailsQuery } from '../../../../../core/query/appuser';
import { CustomErrorHandlerService } from '../../../../../core/services/custom-error-handler.service';

@Component({
  selector: 'app-view-user-details',
  templateUrl: './view-user-details.component.html',
  styleUrls: ['./view-user-details.component.scss']
})
export class ViewUserDetailsComponent implements OnInit {

  userId = 0;
  userDetails: any = {};
  isEditable = false;
  constructor(
    private readonly _activateRouter: ActivatedRoute,
    private readonly _apollo: Apollo,
    private readonly _spinner: NgxSpinnerService,
    private readonly _router: Router,
    private readonly _errorHandler: CustomErrorHandlerService
  ) { }

  ngOnInit(): void {
    this._activateRouter.params.subscribe(params => {
      this.userId = params.id ? parseFloat(params.id) : 0;
      this.getUserDetails();
    });
  }

  getUserDetails() {
    this._spinner.show();
    this._apollo
      .query({
        query: userDetailsQuery,
        variables: {
          id: this.userId
        },
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this._spinner.hide();
        this.userDetails = data['getUserViewDetail'];
        this.isEditable = (this.userDetails?.account_status === 'active');
      }, error => {
        this.isEditable = false;
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  gotoUserEdit() {
    this._router.navigateByUrl(`/app-users/edit-user-details/${this.userId}`);
  }

}
