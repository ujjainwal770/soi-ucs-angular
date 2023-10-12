import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { _CONST } from 'src/app/core/constants/app.constants';
import { getParticipantsListQuery } from 'src/app/core/query/event-calendar';
import { AppConstantService } from 'src/app/core/services/app-constant.service';
import { CustomErrorHandlerService } from 'src/app/core/services/custom-error-handler.service';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-participants-list',
  templateUrl: './participants-list.component.html',
  styleUrls: ['./participants-list.component.scss']
})
export class ParticipantsListComponent implements OnInit {
  sorting = this._sharedService.getSortingData('participantsList');
  eventId;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['full_name', 'email', 'participant_event_status'];
  pageSizes = _CONST['defaultPageSizeArray'];
  pageSizeCount: number = 10;
  count = 0;
  currentPage = 0;
  nextPage: number;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private _activateRouter : ActivatedRoute,
    private readonly _spinner: NgxSpinnerService,
    private readonly _apollo: Apollo,
    private readonly _sharedService: SharedService,
    private readonly _const: AppConstantService,
    private readonly _errorHandler: CustomErrorHandlerService,) { }

  ngOnInit(): void {
    this._activateRouter.params.subscribe(params => {
      this.eventId = params.event_id ? parseFloat(params.event_id) : 0;
      this.getParticipantsList();
    });
  }
  public handlePage(e: PageEvent) {
    this.currentPage = e.pageIndex;
    this.pageSizeCount = e.pageSize;
    this.getParticipantsList();
  }

  getParticipantsList(){
    this._apollo
      .query({
        query: getParticipantsListQuery,
        variables: {
          limit: this.pageSizeCount,
          page: this.currentPage,
          event_id: this.eventId,
          order_by:this.sorting.sortingByColumn,
          order:this.sorting.sortingOrders[this.sorting.currentOrder], 
          participant_event_status: ["ACCEPT", "REJECT", "PENDING"]
        },
        fetchPolicy: 'no-cache',
      }).subscribe(({ data }) => {
        this._spinner.hide();
        const dt = data['getSchoolEventActiveUserForAdmin'];
        this.dataSource = new MatTableDataSource(dt["participant_list"]);
        if(this.sort)
        {
          this.sort.active = this.sorting.sortingByColumn;
          this.sort.direction = this.sorting.sortingOrders[this.sorting.currentOrder].toLowerCase();
          this.dataSource.sort = this.sort;
        }
        this.count = dt['count'];
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
}
customSorting(sortingByColumn) {
  // when different -> existing and new column
  if (this.sorting.sortingByColumn !== sortingByColumn) {
    this.sorting.currentOrder = 1;
    this.sorting.sortingClickCounter = 0;
  }
  this.sorting.sortingByColumn = sortingByColumn;
  this.sorting.sortingClickCounter++;
  switch (this.sorting.sortingClickCounter) {

    //Ascending order
    case _CONST.one:
      this.sorting.currentOrder = 1;
      break;

    // Descending order
    case _CONST.two:
      this.sorting.currentOrder = 0;
      break;

    // Intial order i.e. descending
    case _CONST.three:
      this.sorting = { ...this._const.APP_USER_LIST_DEFAULT_SORTING };
      break;
    default:
      break;
  }
  this._sharedService.setSortingData('participantsList', this.sorting);
  this.getParticipantsList();
}

}
