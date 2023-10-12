import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { schoolUSerCountQuery } from 'src/app/core/query/school-dashboard';
import { CustomErrorHandlerService } from 'src/app/core/services/custom-error-handler.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';

@Component({
  selector: 'app-dashboard-widgets-school',
  templateUrl: './dashboard-widgets-school.component.html',
  styleUrls: ['./dashboard-widgets-school.component.scss']
})
export class DashboardWidgetsSchoolComponent implements OnInit {
  studentCount: any=0;
  studentPendingCount: any;
  card3Content:any=0;
  constructor(private readonly _router: Router,
    private readonly _apollo: Apollo,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    public _localStorage: LocalStorageService,
    private readonly _toastr: ToastrService,) { }

  ngOnInit(): void {
    this.getAnalyticsSchool()
  }
  /**
   * Fetch Count School
   */

   getAnalyticsSchool() {
    this._spinner.show();
    this._apollo
      .watchQuery({
        query: schoolUSerCountQuery,
        variables: {},
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
      }).valueChanges.subscribe(({ data }) => {
        this._spinner.hide();
        this.studentCount = data['getSchoolStudentCount']['total_student_count']
        this.studentPendingCount = data['getSchoolStudentCount']['pending_student_count']

      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

}
