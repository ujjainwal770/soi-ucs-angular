import { SelectionModel } from '@angular/cdk/collections';
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
import { addEventQuery, getEventDetailQuery, getParticipantsQuery, listParticipantsQuery } from 'src/app/core/query/event-calendar';
import { AppConstantService } from 'src/app/core/services/app-constant.service';
import { CustomErrorHandlerService } from 'src/app/core/services/custom-error-handler.service';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {
  sorting = this._sharedService.getSortingData('participantsList');
  addEventForm: FormGroup;
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
  count = 0;
  currentPage = 0;
  nextPage: number;
  isAllSelected:boolean=false;
  selected = [];
  event_id:any;
  // selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    public atp: AmazingTimePickerService,
    private readonly _spinner: NgxSpinnerService,
    private readonly _apollo: Apollo,
    private readonly _toastr: ToastrService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _activateRouter: ActivatedRoute,
    private readonly _sharedService: SharedService,
    private readonly _const: AppConstantService,
    private datePipe: DatePipe,
    public _router: Router,) { 
      this.minStartDate = new Date();
      this.minEndDate = this.minStartDate;
      this._activateRouter.params.subscribe(params => {
        this.event_id = params.event_id;
        if(this.event_id)this.getEventDetails();
      });
    }

  ngOnInit(): void {
    this.addEventForm = new FormGroup({
      'title': new FormControl('', [Validators.required]),
      'start_date': new FormControl('', [Validators.required]),
      'end_date': new FormControl('', [Validators.required]),
      'start_time': new FormControl('', [Validators.required]),
      'end_time': new FormControl('', [Validators.required]),
      'description': new FormControl('', [Validators.required]),

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
         this.setEventForm(data['getEventDetailForAdmin']);
        
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }
  setEventForm(eventDetails)
  {
    this.getFieldR('title').setValue(eventDetails?.title);
    this.getFieldR('description').setValue(eventDetails.description);

  }
  getFieldR(name: string) {
    return this.addEventForm.get(name);
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
    if(this.isToday(this.addEventForm.get('start_date').value) && !this.addEventForm.get('start_time').value){
      this.minStartTime = this.datePipe.transform(new Date(), 'HH:mm');
      this.addEventForm.controls['start_time'].setValue(this.minStartTime);
    }
    const amazingTimePicker = this.atp.open({ "arrowStyle":{'background': '#4C356E'},"changeToMinutes":true,"rangeTime":{
      start: this.minStartTime,
      end: this.maxStartTime
  },"time":this.addEventForm.get('start_time').value});
    amazingTimePicker.afterClose().subscribe(time => {
      this.addEventForm.controls['start_time'].setValue(time);
      this.onStartTimeChange(time)
    });  
  }
 
  openEndTimePicker() {
    if(this.isToday(this.addEventForm.get('end_date').value) && !this.addEventForm.get('end_time').value){
      this.minEndTime = this.addEventForm.get('start_time').value || this.datePipe.transform(new Date(), 'HH:mm');
      this.addEventForm.controls['end_time'].setValue(this.minEndTime);
    }
    else{
      this.addEventForm.controls['end_time'].setValue(this.minEndTime);
    }

    const amazingTimePicker = this.atp.open({ "arrowStyle":{'background': '#4C356E'},"changeToMinutes":true,"rangeTime":{
      start: this.minEndTime,
      end: this.maxEndTime
  },"time":this.addEventForm.get('end_time').value});
    amazingTimePicker.afterClose().subscribe(time => {
      this.addEventForm.controls['end_time'].setValue(time);
      this.onEndTimeChange(time)
      
    });
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
  public handlePage(e: PageEvent) {
    this.currentPage = e.pageIndex;
    this.pageSizeCount = e.pageSize;
    this.getStudentList();
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
        const newdt = data['getSchoolEventActiveUserForAdmin'];
        this.dataSource = new MatTableDataSource(newdt['participant_list']);
        this.dataSource.sort = this.sort;
        this._spinner.hide();      
        this.count = newdt['count'];
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
        const dt = data['getSchoolEventActiveUserForAdmin'];
        this.count = dt['count'];
        this._spinner.hide();
        this.selected = dt["selected_participant_list"];
      
      }, error => {
        this._errorHandler.manageError(error, true);
        this._spinner.hide();
      });
}
isSelected(id)
{
  return this.selected.indexOf(id)!=-1}

CheckdateTime(start_date,start_time,end_date,end_time)
{
// Split the time strings into hours and minutes
const startTimeParts: string[] = start_time.split(":");
const endTimeParts: string[] = end_time.split(":");

// Create Date objects with a common date (e.g., today's date)
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
  submit(){
    if (this.addEventForm.valid) {
      if(this.CheckdateTime(this.addEventForm.value.start_date,this.addEventForm.value.start_time,this.addEventForm.value.end_date,this.addEventForm.value.end_time))
      {
        this.getStudentList();
        if(this.event_id)this.getParticipantsList();
        this.showParticipants = true;
  
      }
     
    } else {
      this.addEventForm.markAllAsTouched();
    }
  }
  getTimestamp(date,time) { 
    const [hours, minutes] = time.split(':').map(Number);

    const DateTime = moment(date).set({ hour: hours, minute: minutes, second: 0, millisecond: 0 });
const utcDateTime = moment.utc(DateTime).valueOf();
return (utcDateTime);


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
  isMinParticipants(){
    return (this.isAllSelected && this.selected.length!=this.count) || (!this.isAllSelected && this.selected.length>0)
  }
  addEvent(){
    
   if(this.isMinParticipants())
   {
    this._spinner.show();
      this._apollo.mutate({
        mutation: addEventQuery,
        variables: {
          title:this.addEventForm.value.title,
          description:this.addEventForm.value.description,
          start_date_time:this.getTimestamp(this.addEventForm.value.start_date,this.addEventForm.value.start_time),
          end_date_time:this.getTimestamp(this.addEventForm.value.end_date,this.addEventForm.value.end_time),
          is_select_all_participant: this.isAllSelected?1:0,
          participant_ids:this.selected
        }
      }).subscribe(() => {
        this._spinner.hide();
        this.gotoEventList();
        this._toastr.success('Event has been created successfully');

      }, error => {
        this._errorHandler.manageError(error, true);
        this._spinner.hide();
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
    if(this.isToday(this.addEventForm.get('start_date').value)){
      this.addEventForm.controls['start_time'].setValue('');
    }
    // When the start date changes, update the minimum end date accordingly
    this.minEndDate = event.target.value;
    const endDate = this.addEventForm.get('end_date').value ;

    if(endDate.toString() !== event.target.value.toString()){
      this.maxStartTime = undefined;
      this.minEndTime = undefined;
    }
  }

  onEndDateChange(event: any) {
    if(this.isToday(this.addEventForm.get('end_date').value)){
      this.addEventForm.controls['end_time'].setValue('');
    }
    // When the end date changes, update the maximum start date accordingly
    const startDate = this.addEventForm.get('start_date').value ;

    this.maxStartDate = event.target.value;
    if( startDate.toString() !== event.target.value.toString()){
      this.maxStartTime = undefined;
      this.minEndTime = undefined;
    }
  }

  
  onStartTimeChange(time: string) {
    // When the start date changes, update the minimum end date accordingly
    const startDate = this.addEventForm.get('start_date').value ;
    const endDate = this.addEventForm.get('end_date').value;
    if(startDate && endDate && startDate.toString() === endDate.toString()){
    this.minEndTime = time;}
  }

  onEndTimeChange(time: string) {    
    // When the end date changes, update the maximum start date accordingly
    const startDate = this.addEventForm.get('start_date').value ;
    const endDate = this.addEventForm.get('end_date').value;
    if(startDate && endDate && startDate.toString() === endDate.toString()){

    this.maxStartTime = time;
  }
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
        this.sorting = { ...this._const.APP_USER_LIST_DEFAULT_SORTING };
        break;
      default:
        break;
    }
    this._sharedService.setSortingData('participantsList', this.sorting);
    this.getStudentList();
  }


}
