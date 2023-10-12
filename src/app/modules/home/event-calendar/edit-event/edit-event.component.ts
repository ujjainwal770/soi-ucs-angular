import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { Apollo } from 'apollo-angular';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { _CONST } from 'src/app/core/constants/app.constants';
import { addEventQuery, editEventQuery, getEventDetailQuery, getParticipantsQuery, listParticipantsQuery } from 'src/app/core/query/event-calendar';
import { AppConstantService } from 'src/app/core/services/app-constant.service';
import { CustomErrorHandlerService } from 'src/app/core/services/custom-error-handler.service';
import { DialogsService } from 'src/app/core/services/dialog-service';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss']
})
export class EditEventComponent implements OnInit {
  sorting = this._sharedService.getSortingData('participantsList');
  editEventForm: FormGroup;
  minStartDate: Date;
  maxStartDate: Date;
  minEndDate: Date;
  maxEndDate: Date;
  minStartTime: string;
  maxStartTime: string;
  minEndTime: string;
  maxEndTime: string;
  showParticipants:boolean = false;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['id','full_name', 'email', 'date_of_birth', 'phone'];
  pageSizes = _CONST['defaultPageSizeArray'];
  pageSizeCount = 10;
  selected = [];
  previousSelected = [];
  event_id: any;
  eventDetails:any;
  count = 0;
  currentPage = 0;
  nextPage: number;
  isAllSelected:boolean=false;
  // selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    public atp: AmazingTimePickerService,
    private _dialogsService: DialogsService,
    private readonly _spinner: NgxSpinnerService,
    private readonly _apollo: Apollo,
    private readonly _toastr: ToastrService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _activateRouter: ActivatedRoute,
    private datePipe: DatePipe,
    private readonly _sharedService: SharedService,
    private readonly _const: AppConstantService,
    public _router: Router,) { 
      this.minStartDate = new Date();
      this.minEndDate = this.minStartDate;
      this._activateRouter.params.subscribe(params => {
        this.event_id = params.event_id;
        this.getEventDetails();
        this.getParticipantsList();

      });
    }
  getEventDetails()
  {
    const inputVariables = {
      event_id: parseFloat(this.event_id),
      local_time_zone_offset_in_minutes:((new Date()).getTimezoneOffset()  *-1)

    };
    this._spinner.show();
    this._apollo
      .query({
        query: getEventDetailQuery,
        variables: inputVariables,
        fetchPolicy: 'no-cache',
      }).subscribe(({ data }) => {
        this._spinner.hide();       
         this.eventDetails = data['getEventDetailForAdmin'];
         this.setEventForm();
        
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }
  setEventForm()
  {
    this.getFieldR('title').setValue(this.eventDetails?.title);
    this.getFieldR('description').setValue(this.eventDetails.description);
    this.getFieldR('start_date').setValue(new Date(this.datePipe.transform(this.eventDetails.start_date_time, 'MM/dd/yyy')));
    this.getFieldR('end_date').setValue(new Date(this.datePipe.transform(this.eventDetails.end_date_time, 'MM/dd/yyy')));
    this.getFieldR('start_time').setValue(this.datePipe.transform(this.eventDetails.start_date_time, 'HH:mm'));
    this.onStartTimeChange(this.datePipe.transform(this.eventDetails.start_date_time, 'HH:mm'))
    this.getFieldR('end_time').setValue(this.datePipe.transform(this.eventDetails.end_date_time, 'HH:mm'));
    this.onEndTimeChange(this.datePipe.transform(this.eventDetails.end_date_time, 'HH:mm'))
  }

  ngOnInit(): void {
    this.editEventForm = new FormGroup({
      'title': new FormControl('', [Validators.required]),
      'start_date': new FormControl('', [Validators.required]),
      'end_date': new FormControl('', [Validators.required]),
      'start_time': new FormControl('', [Validators.required]),
      'end_time': new FormControl('', [Validators.required]),
      'description': new FormControl('', [Validators.required]),

    });
  }

  getFieldR(name: string) {
    return this.editEventForm.get(name);
  }
  isToday(dateToCheck)
  {
    dateToCheck = new Date(dateToCheck);
    const currentDate = new Date();
 return  (dateToCheck.getFullYear() === currentDate.getFullYear() &&
  dateToCheck.getMonth() === currentDate.getMonth() &&
  dateToCheck.getDate() === currentDate.getDate());
  }
  open() {
    if(this.isToday(this.editEventForm.get('start_date').value)){
      this.minStartTime = this.datePipe.transform(new Date(), 'HH:mm');
    }
    const amazingTimePicker = this.atp.open({ "arrowStyle":{'background': '#4C356E'},"changeToMinutes":true,"rangeTime":{
      start: this.minStartTime,
      end: this.maxStartTime
  },"time":this.editEventForm.get('start_time').value});
    amazingTimePicker.afterClose().subscribe(time => {
      this.editEventForm.controls['start_time'].setValue(time);
      this.onStartTimeChange(time)
    });
      
  }
 
  openEndTimePicker() {
    if(this.isToday(this.editEventForm.get('end_date').value)){
      this.minEndTime = this.editEventForm.get('start_time').value || this.datePipe.transform(new Date(), 'HH:mm');
    }
   
    const amazingTimePicker = this.atp.open({ "arrowStyle":{'background': '#4C356E'},"changeToMinutes":true,"rangeTime":{
      start: this.minEndTime,
      end: this.maxEndTime
  },"time":this.editEventForm.get('end_time').value});
    amazingTimePicker.afterClose().subscribe(time => {
      this.editEventForm.controls['end_time'].setValue(time);
      this.onEndTimeChange(time)
      
    });
  }
  public handlePage(e: PageEvent) {
    this.currentPage = e.pageIndex;
    this.pageSizeCount = e.pageSize;
    this.getStudentList();
  }
  toggleToSelect(){
    this.selected = [];
  }
  ngAfterViewChecked(): void {
    // Access and use sort after view is checked
    if (this.sort) {
      // Perform sorting logic here
      this.sort.active = this.sorting.sortingByColumn;
      this.sort.direction = this.sorting.sortingOrders[this.sorting.currentOrder].toLowerCase();
    }
  }
  getStudentList()
  {
    this._apollo
      .query({
        query: listParticipantsQuery,
        variables: {
          limit: this.pageSizeCount,
          page: this.currentPage,
          order_by:this.sorting.sortingByColumn,
          order:this.sorting.sortingOrders[this.sorting.currentOrder], 
        },
        fetchPolicy: 'no-cache',
      }).subscribe(({ data }) => {
        this._spinner.hide();      
        const dt = data['getSchoolEventActiveUserForAdmin'];
        this.dataSource = new MatTableDataSource(dt['participant_list']);
        this.dataSource.sort = this.sort;
        this.count = dt['count'];
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }
  getParticipantsList(){
    this._apollo
      .query({
        query: getParticipantsQuery,
        variables: {
          limit: this.pageSizeCount,
          page: this.currentPage,
          event_id: parseFloat(this.event_id),
          participant_event_status: ["ACCEPT", "REJECT", "PENDING"]
        },
        fetchPolicy: 'no-cache',
      }).subscribe(({ data }) => {
        this._spinner.hide();
        const dt = data['getSchoolEventActiveUserForAdmin'];
        this.selected = dt["selected_participant_list"];
        this.previousSelected = JSON.parse(JSON.stringify(this.selected));      
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
}

CheckdateTime(start_date,start_time,end_date,end_time)
{
// Split the time strings into hours and minutes
const startTimeParts: string[] = start_time.split(":");
const endTimeParts: string[] = end_time.split(":");
start_date = new Date(start_date);
end_date = new Date(end_date);
const startTime: Date = new Date(start_date.getFullYear(), start_date.getMonth(), start_date.getDate(), parseInt(startTimeParts[0]), parseInt(startTimeParts[1]));
const endTime: Date = new Date(end_date.getFullYear(), end_date.getMonth(), end_date.getDate(), parseInt(endTimeParts[0]), parseInt(endTimeParts[1]));

// Compare startTime and endTime
if (endTime > startTime) {
  return true
} else {
  this._toastr.error('The event end date time should be greater than the start date time');
  return false
}

}
isSelected(id)
{
  return this.selected.indexOf(id)!=-1}
  submit(){

    if (this.editEventForm.valid) { 
      if(this.CheckdateTime(this.editEventForm.value.start_date,this.editEventForm.value.start_time,this.editEventForm.value.end_date,this.editEventForm.value.end_time))
      {
        this.getStudentList();
        this.showParticipants = true;
  
      }    
    } else {
      this.editEventForm.markAllAsTouched();
    }
  }
  getTimestamp(date,time) { 
    const [hours, minutes] = time.split(':').map(Number);

    const DateTime = moment(date).set({ hour: hours, minute: minutes, second: 0, millisecond: 0 });
const utcDateTime = moment.utc(DateTime).valueOf();
return (utcDateTime);


  }
  isMinParticipants(){
    return (this.isAllSelected && this.selected.length!=this.count) || (!this.isAllSelected && this.selected.length>0)
  }
  arraysAreEqual(arr1: any[], arr2: any[]): boolean {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
}
  confirmEdit()
  {
    if(!(this.arraysAreEqual(this.selected,this.previousSelected))){
      const pgtitle = "Cancel"
      const message = `You have made changes to the list of participants.Updates will be sent to the added or deleted participants.`;
      this._dialogsService
      .eventCancelDialogPopUp(pgtitle, message,'alert')
      .subscribe(res => {
        if (res) {
          
          this.editEvent();
        }
      });
    }
    else{
      this.editEvent();
    }
  }

  editEvent()
  {
    if(this.isMinParticipants())
   {
    this._spinner.show();
      this._apollo.mutate({
        mutation: editEventQuery,
        variables: {
          id:parseFloat(this.event_id),
          title:this.editEventForm.value.title,
          description:this.editEventForm.value.description,
          start_date_time:this.getTimestamp(this.editEventForm.value.start_date,this.editEventForm.value.start_time),
          end_date_time:this.getTimestamp(this.editEventForm.value.end_date,this.editEventForm.value.end_time),
          is_select_all_participant: this.isAllSelected?1:0,
          participant_ids:this.selected
        }
      }).subscribe(() => {
        this._spinner.hide();
        this._toastr.success('Event has been updated successfully');
        this.gotoEventList();
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
    }
    else{
      this._toastr.error('Please select minimum one participant');
    }
  }
  gotoEventList() {
    this._router.navigateByUrl('/manage-events');
  }

  onStartDateChange(event: any) {
    if(this.isToday(this.editEventForm.get('start_date').value)){
      this.editEventForm.controls['start_time'].setValue('');
    }
    // When the start date changes, update the minimum end date accordingly
    this.minEndDate = event.target.value;
    const endDate = this.editEventForm.get('end_date').value ;

    if(endDate.toString() !== event.target.value.toString()){
      this.maxStartTime = undefined;
      this.minEndTime = undefined;
    }
  }

  onEndDateChange(event: any) {
    if(this.isToday(this.editEventForm.get('end_date').value)){
      this.editEventForm.controls['end_time'].setValue('');
    }
    // When the end date changes, update the maximum start date accordingly
    const startDate = this.editEventForm.get('start_date').value ;

    this.maxStartDate = event.target.value;
    if( startDate.toString() !== event.target.value.toString()){
      this.maxStartTime = undefined;
      this.minEndTime = undefined;
    }
  }

  
  onStartTimeChange(time: string) {
    // When the start date changes, update the minimum end date accordingly
    const startDate = this.editEventForm.get('start_date').value ;
    const endDate = this.editEventForm.get('end_date').value;
    console.log(startDate.toString(),endDate.toString());
    if(startDate && endDate && startDate.toString() === endDate.toString()){
      console.log("minendtime",time);
      
    this.minEndTime = time;}
  }

  onEndTimeChange(time: string) {    
    // When the end date changes, update the maximum start date accordingly
    const startDate = this.editEventForm.get('start_date').value ;
    const endDate = this.editEventForm.get('end_date').value;
    if(startDate && endDate && startDate.toString() === endDate.toString()){
      console.log("maxendtime",time);

    this.maxStartTime = time;
  }
  }
  OnChange(id){
    const index = this.selected.indexOf(id);

  if (index !== -1) {
    // Number exists in the array, so remove it
    this.selected.splice(index, 1);
  } else {
    // Number doesn't exist in the array, so add it
    this.selected.push(id);
  }
    
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
    this.getStudentList();
  }


}
