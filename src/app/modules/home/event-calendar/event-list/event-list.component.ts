import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { _CONST } from 'src/app/core/constants/app.constants';
import { cancelEventQuery, getCalendarEventsListOfDayQuery, getCalendarEventsListQuery } from 'src/app/core/query/event-calendar';
import { AppConstantService } from 'src/app/core/services/app-constant.service';
import { CustomErrorHandlerService } from 'src/app/core/services/custom-error-handler.service';
import { DialogsService } from 'src/app/core/services/dialog-service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  sorting = this._sharedService.getSortingData('eventListing');
  displayedColumns: string[] = ['start_date_time','title', 'description','actions'];
  pageSizes = _CONST['defaultPageSizeArray'];
  pageSizeCount = 10;
  count = 0;
  currentPage = 0;
  nextPage: number;
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort) sort: MatSort;

  @Output() viewDetails: EventEmitter<any> = new EventEmitter();
  @Output() eventAction: EventEmitter<any> = new EventEmitter();
  @Input() viewDate;



  
  constructor( public _localStorage: LocalStorageService,
    private readonly _apollo: Apollo,
    private _router: Router,
    private readonly _spinner: NgxSpinnerService,
    private changeDetectorRefs: ChangeDetectorRef,
    private readonly _sharedService: SharedService,
    private readonly _const: AppConstantService,
    private readonly _toastr: ToastrService,
    private _dialogsService: DialogsService,
    private readonly _errorHandler: CustomErrorHandlerService) { 
      
    }

  ngOnInit(): void {
    this.getListEvent();
  }
  getListEvent()
  {
    console.log(this.viewDate);
    let options = {}
    if(this.viewDate)
    options = {
      start_date:new Date(this.viewDate).setHours(0,0,0),
      end_date:new Date(this.viewDate).setHours(23,59,0),

    }
    let currentSchoolId = this._localStorage.getSchoolAdminSchoolId();
    this._apollo
    .query({
      query: this.viewDate?getCalendarEventsListOfDayQuery:getCalendarEventsListQuery,
      variables: {
        ...options,
        limit: this.pageSizeCount,
        page: this.currentPage,
        school_id: currentSchoolId,
        local_time_zone_offset_in_minutes:((new Date()).getTimezoneOffset()  *-1),
        order_by: this.sorting.sortingByColumn,
        order: this.sorting.sortingOrders[this.sorting.currentOrder]
      },
      fetchPolicy: 'no-cache',
    }).subscribe(({ data }) => {
      this._spinner.hide();      
     let eventList = data["getCalendarEventListByEvent"]["event_list"]
     eventList.forEach(element => {
      element["start"] = new Date(element.start_date_time);
      element["end"] = new Date(element.end_date_time);
    });
     this.dataSource = new MatTableDataSource(data["getCalendarEventListByEvent"]["event_list"]); 
     this.sort.active = this.sorting.sortingByColumn;
     this.sort.direction = this.sorting.sortingOrders[this.sorting.currentOrder].toLowerCase();
     this.dataSource.sort = this.sort;
    this.count = data["getCalendarEventListByEvent"]['count']; 
    this.changeDetectorRefs.detectChanges();
    }, error => {
      this._spinner.hide();
      this._errorHandler.manageError(error, true);
    });
  }
  public handlePage(e: PageEvent) {
    this.currentPage = e.pageIndex;
    this.pageSizeCount = e.pageSize;
    this.getListEvent();
  }
  openDetails(element){
    this.viewDetails.emit(element)
  }

  goBack()
  {
    this.eventAction.emit();
  }
  customSorting(sortingByColumn) {
    // when different -> existing and new column
    if (this.sorting.sortingByColumn !== sortingByColumn) {
      this.sorting.currentOrder = 1;
      this.sorting.sortingClickCounter = 0;
    }

    this.sorting.sortingClickCounter++;
    this.sorting.sortingByColumn = sortingByColumn;
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
        this.sorting = { ...this._const.APP_EVENT_LIST_DEFAULT_SORTING };
        break;
      default:
        break;
    }
    this._sharedService.setSortingData('eventListing', this.sorting);
    this.getListEvent();
  }
  
  cancelEvent(id)
  {
    this._spinner.show();
        this._apollo.mutate({
          mutation: cancelEventQuery,
          variables: {
            event_id:id,
            
          }
        }).subscribe(() => {
          this._spinner.hide();
          this._toastr.success('Event has been cancel successfully');
          this.getListEvent()

        }, error => {
          this._spinner.hide();
          this._errorHandler.manageError(error, true);
        });

  }
  deleteEvent(id)
  {
    const pgtitle = "Cancel"
    const message = `Are you sure you want to cancel this event and send out cancellation notification to the participants?`;
    this._dialogsService
    .eventCancelDialogPopUp(pgtitle, message,'alert')
    .subscribe(res => {
      if (res) {
        
        this.cancelEvent(id);
      }
    });
  }
  editEvent(id)
  {
    this._router.navigateByUrl('/manage-events/edit-event/'+id);
  }
  copyEvent(id){
    this._router.navigateByUrl('/manage-events/add-event/'+id);
  }

}
