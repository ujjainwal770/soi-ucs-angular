import { ChangeDetectionStrategy, Component, OnInit, TemplateRef } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { cancelEventQuery, getCalendarEventsQuery, getParticipantsQuery } from 'src/app/core/query/event-calendar';
import { CustomErrorHandlerService } from 'src/app/core/services/custom-error-handler.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { DialogsService } from 'src/app/core/services/dialog-service';
import { ToastrService } from 'ngx-toastr';
import { _CONST } from 'src/app/core/constants/app.constants';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';

@Component({
  selector: 'app-event-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './event-calendar.component.html',
  styleUrls: ['./event-calendar.component.scss']
})
export class EventCalendarComponent implements OnInit {

  viewDate: Date = new Date();
  view: any = 'month';
  clickedDate: Date;
  activeDayIsOpen: boolean = true;
  events: any[] =[];
  refresh: Subject<any> = new Subject();
  modalRef?: BsModalRef;
  selectedEvent:any;
  participantsList:any;
  participantCount:number;
  firstTwoParticipants;
  others;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['start_date_time','title', 'description','actions'];
  pageSizes = _CONST['defaultPageSizeArray'];
  pageSizeCount = 10;
  count = 0;
  currentPage = 0;
  nextPage: number;
  eventView: string = 'calender';
  listDate:Date;
  viewEventList:Boolean = false;

  constructor( private readonly _spinner: NgxSpinnerService,
    private readonly _apollo: Apollo,
    private modalService: BsModalService,
    private _router: Router,
    private _dialogsService: DialogsService,
    private readonly _toastr: ToastrService,
    public _localStorage: LocalStorageService,
    private readonly _errorHandler: CustomErrorHandlerService,) { }

  ngOnInit(): void {
    this.getCalendarEvents(new Date(this.viewDate).getUTCMonth()+1,new Date(this.viewDate).getUTCFullYear())
  }
  
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
  updateView(view)
  {
    this.eventView = view;
    this.listDate = undefined;
  }
 
  getCalendarEvents(month,year){   
    this._apollo
      .query({
        query: getCalendarEventsQuery,
        variables: {
          limit: this.pageSizeCount,
          page: this.currentPage,
          year:year,
          month:month,
          local_time_zone_offset_in_minutes:((new Date()).getTimezoneOffset()  *-1)
        },
        fetchPolicy: 'no-cache',
      }).subscribe(({ data }) => {
        this._spinner.hide();      
       // console.log(data["event_view"]);
        this.covertData(data["getCalendarEventViewForAdmin"]["event_view"]);
        this.count = data["getCalendarEventViewForAdmin"]["event_view"]['count'];
        

      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }
  public handlePage(e: PageEvent) {
    this.currentPage = e.pageIndex;
    this.pageSizeCount = e.pageSize;
    this.getCalendarEvents(new Date(this.viewDate).getUTCMonth()+1,new Date(this.viewDate).getUTCFullYear());
  }
  getParticipants(event){
    let participantCount = 0;
    let participantsList = [];
    this.firstTwoParticipants = '';
    this.others = '';
      this._apollo
        .query({
          query: getParticipantsQuery,
          variables: {
            limit: 10,
            page: 0,
            event_id: event.id,
			      participant_event_status: ["ACCEPT", "REJECT", "PENDING"]
          },
          fetchPolicy: 'no-cache',
        }).subscribe(({ data }) => {
          this._spinner.hide();   
           participantCount = data['getSchoolEventActiveUserForAdmin']['count']
           participantsList =  data['getSchoolEventActiveUserForAdmin']['participant_list'] 
          if(participantsList[0])
          {
            this.firstTwoParticipants = participantsList[0]['full_name'];
          }
          if(participantsList[1])
          {
            this.firstTwoParticipants+=' , '+ participantsList[1]['full_name'];
          }
          if(participantCount>2)
          {
            this.others = participantCount-2 + ' Others'
          }

        }, error => {
          this._spinner.hide();
          this._errorHandler.manageError(error, true);
        });
  }
  
  

  covertData(input)
  {
   this.events = [];
    input.map((item) => {
      item.event_list.forEach(event => {

      
        this.events.push({
          id:event.id,
          is_completed: event.is_completed,
          start: new Date(event.start_date_time),
          end: new Date(event.end_date_time),
          title: event.title,
          description: event.description,
          allDay: true,
          resizable: {
            beforeStart: true,
            afterEnd: true,
          },
          draggable: true,
        });
      });
     
    });
    this.dataSource = new MatTableDataSource(this.events); 
    this.refresh.next(); 
  }

  goToParticipantsList(eventId)
  {
  this.modalService.hide()
    this._router.navigateByUrl('/manage-events/participants/'+eventId);
  }
  DateChange(viewDate)
  {
    this.viewDate = viewDate
    this.getCalendarEvents(new Date(this.viewDate).getUTCMonth()+1,new Date(this.viewDate).getUTCFullYear())
    
  }
  deleteEvent(id)
  {
    const pgtitle = "Cancel"
    const message = `Are you sure you want to cancel this event and send out cancellation notification to the participants?`;
    this._dialogsService
    .eventCancelDialogPopUp(pgtitle, message,'cancel')
    .subscribe(res => {
      if (res) {
        
        this.cancelEvent(id);
      }
    });
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
          this.getCalendarEvents(new Date(this.viewDate).getUTCMonth()+1,new Date(this.viewDate).getUTCFullYear())

        }, error => {
          this._spinner.hide();
          this._errorHandler.manageError(error, true);
        });

  }
  editEvent(id)
  {
    this._router.navigateByUrl('/manage-events/edit-event/'+id);
  }
  copyEvent(id){
    this._router.navigateByUrl('/manage-events/add-event/'+id);
  }
  action()
  {
    this.listDate = undefined;
    this.viewEventList = false;
  }
  
  openModal(template: TemplateRef<any>,event) {
    this.firstTwoParticipants = '';
    this.getParticipants(event)
    this.selectedEvent = event;   
    this.modalRef = this.modalService.show(template,{class: 'modal-dialog-centered' });
  }
  openEventList(viewDate){
    this.listDate = viewDate;
    this.viewEventList = true;

  }
  
}
