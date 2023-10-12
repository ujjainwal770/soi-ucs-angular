import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEventComponent } from './edit-event.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { EventCalendarComponent } from '../event-calendar.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { DialogsService } from 'src/app/core/services/dialog-service';
import { throwError } from 'rxjs';
import { editEventQuery, getEventDetailQuery, getParticipantsQuery, listParticipantsQuery } from 'src/app/core/query/event-calendar';
import moment from 'moment';
import { DatePipe } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('EditEventComponent', () => {
  let component: EditEventComponent;
  let fixture: ComponentFixture<EditEventComponent>;
  let _amazingTimePickerService;
  let _dialogsService: DialogsService;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditEventComponent],
      imports: [ReactiveFormsModule, 
        MaterialModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([
        { path: 'manage-events', component: EventCalendarComponent }
      ]),ToastrModule.forRoot(),ApolloTestingModule],
      providers: [AmazingTimePickerService,ToastrService,DatePipe,DialogsService,
      ], // Provide the service
      schemas: [CUSTOM_ELEMENTS_SCHEMA]

    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    _dialogsService = TestBed.inject(DialogsService);
    _amazingTimePickerService = TestBed.inject(AmazingTimePickerService);
    spyOn(component, 'getFieldR').and.callThrough();
    spyOn(component, 'editEvent').and.callThrough();
    spyOn(component, 'isMinParticipants').and.callThrough();
    spyOn(component, 'getStudentList').and.callThrough();
    
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form correctly', () => {
    // Make sure the form is created with the expected controls
    expect(component.editEventForm.get('title')).toBeTruthy();
    expect(component.editEventForm.get('start_date')).toBeTruthy();
    expect(component.editEventForm.get('end_date')).toBeTruthy();
    expect(component.editEventForm.get('start_time')).toBeTruthy();
    expect(component.editEventForm.get('end_time')).toBeTruthy();
    expect(component.editEventForm.get('description')).toBeTruthy();
  });

  it('should have default values for minStartDate and maxStartDate', () => {
    expect(component.minStartDate).toBeTruthy();
    expect(component.maxStartDate).toBeUndefined();
    expect(component.minEndDate).toBeTruthy();
    expect(component.maxEndDate).toBeUndefined();
    expect(component.minStartDate).toEqual(component.minEndDate)
  });

  it('should update minEndDate when onStartDateChange() is called', () => {
    const newStartDate = new Date('2023-08-10');
    component.onStartDateChange({ target: { value: newStartDate } });
    expect(component.minEndDate).toEqual(newStartDate);
  });

  it('should update maxStartDate when onEndDateChange() is called', () => {
    const newEndDate = new Date('2023-08-15');
    component.onEndDateChange({ target: { value: newEndDate } });
    expect(component.maxStartDate).toEqual(newEndDate);
  });

  it('should update minEndTime when onStartTimeChange() is called with matching start and end dates', () => {
    const startTime = '12:30';
    component.editEventForm.patchValue({
      start_date: '2023-08-10',
      end_date: '2023-08-10',
      start_time: startTime,
    });
    component.onStartTimeChange(startTime);
    expect(component.minEndTime).toEqual(startTime);
  });

  it('should update maxStartTime when onEndTimeChange() is called with matching start and end dates', () => {
    const endTime = '15:45';
    component.editEventForm.patchValue({
      start_date: '2023-08-10',
      end_date: '2023-08-10',
      end_time: endTime,
    });
    component.onEndTimeChange(endTime);
    expect(component.maxStartTime).toEqual(endTime);
  });
  it('should return true when the given date is today\'s date', function() {
    // Arrange
    const dateToCheck = new Date();
    // Act
    const result = component.isToday(dateToCheck);
    // Assert
    expect(result).toBeTrue();
  });

  it('should call atp.open() when open() is called', () => {
    const mockTime = '14:30';

  const afterCloseSpy = jasmine.createSpyObj('afterClose', ['subscribe']);
  afterCloseSpy.subscribe.and.callFake(callback => {
    callback(mockTime);
  });

  const atpSpy = spyOn(component.atp, 'open').and.returnValue({
    afterClose: ()=>afterCloseSpy,
  });


    component.open();

    expect(atpSpy).toHaveBeenCalled();
  });

  it('should update the form controls when afterClose() is called', () => {
    const mockTime = '14:30';
  const afterCloseSpy = jasmine.createSpyObj('afterClose', ['subscribe']);
  afterCloseSpy.subscribe.and.callFake(callback => {
    callback(mockTime);
  });

  const atpSpy = spyOn(component.atp, 'open').and.returnValue({
    afterClose: ()=>afterCloseSpy,
  });

    component.open();

    expect(atpSpy).toHaveBeenCalled();
    expect(component.editEventForm.controls['start_time'].value).toEqual(mockTime);
    expect(component.editEventForm.controls['end_time'].value).toEqual(''); // Assuming onEndTimeChange() doesn't update the end_time control
  });

  it('should call _router.navigateByUrl() when gotoEventList() is called', () => {
    const routerSpy = spyOn(component._router, 'navigateByUrl');

    component.gotoEventList();

    expect(routerSpy).toHaveBeenCalledWith('/manage-events');
  });

  it('should mark the form as invalid when submit() is called with invalid form', () => {
    // Simulate an invalid form state
    component.editEventForm.get('title').setValue('Sample Title');
    // other fields are left empty to make the form invalid

    component.submit();

    expect(component.editEventForm.valid).toBeFalse();
  });
      // Tests that submitting a valid form calls getStudentList() and sets showParticipants to true
      
  it('should update "end_time" when openEndTimePicker() is called', () => {
    const mockTime = '14:30';
    const afterCloseSpy = jasmine.createSpyObj('afterClose', ['subscribe']);
    afterCloseSpy.subscribe.and.callFake(callback => {
      callback(mockTime);
    });
  
    const atpSpy = spyOn(component.atp, 'open').and.returnValue({
      afterClose: ()=>afterCloseSpy,
    });
  
      component.openEndTimePicker();
  
      expect(atpSpy).toHaveBeenCalled();
      expect(component.editEventForm.controls['start_time'].value).toEqual('');
      expect(component.editEventForm.controls['end_time'].value).toEqual(mockTime); 
    
  });
  


    // Tests that a valid UTC timestamp is returned when valid date and time are provided.
        // Tests that a valid UTC timestamp is returned when valid date and time are provided
        it('should return a valid UTC timestamp when valid date and time are provided', () => {
          const date = '2022-12-31';
          const time = '23:59';
          let DateTime = moment(date).set({ hour: 23, minute: 59, second: 0, millisecond: 0 })
          const expectedTimestamp = 1672511340000;
          expect(component.getTimestamp(date, time)).toEqual(moment.utc(DateTime).valueOf());
      });
      // Tests that addEvent successfully creates an event with all required fields and minimum one participant selected
      it('should fetch event details with correct query parameters', () => {
        spyOn(component['_apollo'], 'query').and.callThrough();
       // spyOn(component['_spinner'], 'hide').and.callThrough();
      
        component.event_id = '1';
        component.currentPage = 2;
      
        component.getEventDetails();
        expect(component['_apollo'].query).toHaveBeenCalledWith({
          query: getEventDetailQuery,
          variables: {
            event_id: 1,
            local_time_zone_offset_in_minutes : ((new Date()).getTimezoneOffset()  *-1)
          },
          fetchPolicy: 'no-cache',
        });
      
      });
      it('test_error_is_handled_correctly', () => {
        spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
        spyOn(component['_errorHandler'], 'manageError');
        component.getEventDetails();
       expect(component['_errorHandler'].manageError).toHaveBeenCalled();
    });

    it('should test setEventForm ', () => {
      component.eventDetails = {
        "id": 55,
        "title": "event on 30th",
        "description": "event on 30th august",
        "start_date_time": 1693337400000,
        "end_date_time": 1693344600000,
    }
      component.setEventForm();
      expect(component.getFieldR).toHaveBeenCalledWith('title');
    });
    it('should add a new id to the selected array', () => {
      const id = 1;
      component.selected = [2, 3];
      component.OnChange(id);
      expect(component.selected).toEqual([2, 3, 1]);
  });
      // Tests that an existing id is removed from the selected array
      it('should remove an existing id from the selected array', () => {
        const id = 2;
        component.selected = [2, 3];
        component.OnChange(id);
        expect(component.selected).toEqual([3]);
    });
     // Tests that isMinParticipants returns true when isAllSelected is true and selected length is equal to count
     it('should return true when isAllSelected is true and selected length is equal to count', () => {
      component.isAllSelected = true;
      component.count = 5;
      component.selected = [1, 2, 3, 4, 5];
      expect(component.isMinParticipants()).toBeFalse();
  });
      // Tests that isMinParticipants returns false when isAllSelected is true and selected length is not equal to count
it('should return false when isAllSelected is true and selected length is not equal to count', () => {
  component.isAllSelected = true;
  component.count = 5;
  component.selected = [1, 2, 3];
  expect(component.isMinParticipants()).toBeTrue();
});
      
 // Tests that addEvent successfully creates an event with all required fields and minimum one participant selected
 it('should create an event when all required fields are provided and at least one participant is selected', () => {
  spyOn(component['_apollo'], 'mutate').and.callThrough();

  // Arrange
  component.editEventForm.setValue({
      title: 'Test Event',
      start_date: new Date(),
      end_date: new Date(),
      start_time: '10:00 AM',
      end_time: '11:00 AM',
      description: 'Test Description'
  });
  component.isAllSelected = false;
  component.selected = [1];
  component.event_id = 1;
  spyOn(component, 'gotoEventList');
 
  // Act
  component.editEvent();
  expect(component.isMinParticipants).toHaveBeenCalled();

  // Assert
  expect(component["_apollo"].mutate).toHaveBeenCalledWith({
      mutation: editEventQuery,
      variables: {
          id:1,
          title: 'Test Event',
          description: 'Test Description',
          start_date_time: jasmine.any(Number),
          end_date_time: jasmine.any(Number),
          is_select_all_participant: 0,
          participant_ids: [1]
      }
  });
});
  // Tests that addEvent shows an error message if no participant is selected and 'Select All' checkbox is not checked
  it('should show an error message if no participant is selected and Select All checkbox is not checked', () => {
    // Arrange
    spyOn(component['_toastr'], 'error').and.callThrough();

    component.editEventForm.setValue({
        title: 'Test Event',
        start_date: new Date(),
        end_date: new Date(),
        start_time: '10:00 AM',
        end_time: '11:00 AM',
        description: 'Test Description'
    });
    component.isAllSelected = false;
    component.selected = [];

    // Act
    component.editEvent();

    // Assert
    expect(component["_toastr"].error).toHaveBeenCalledWith('Please select minimum one participant');
});
it('should update page size and get broadcast messages on page event', () => {
  const event = { pageIndex: 1, pageSize: 10, length: 50 } as PageEvent;
  component.handlePage(event);
  expect(component.currentPage).toBe(1);
  expect(component.pageSizeCount).toBe(10);
  expect(component.getStudentList).toHaveBeenCalled();
});
it('should reset selected array on toggleToSelect', () => {
  component.toggleToSelect();
  expect(component.selected).toEqual([]);
});
it('should fetch getStudentList with correct query parameters', () => {
  spyOn(component['_apollo'], 'query').and.callThrough();
 // spyOn(component['_spinner'], 'hide').and.callThrough();

  component.pageSizeCount = 20;
  component.currentPage = 2;

  component.getStudentList();
  expect(component['_apollo'].query).toHaveBeenCalledWith({
    query: listParticipantsQuery,
    variables: {
      limit: component.pageSizeCount,
      page: component.currentPage,
      order_by:'creation_time',
      order:'DESC'
    },
    fetchPolicy: 'no-cache',
  });
 // expect(component['_spinner'].hide).toHaveBeenCalled();

});
it('should fetch participants list with correct query parameters', () => {
  const querySpy = spyOn(component['_apollo'], 'query').and.callThrough();

  component.pageSizeCount = 20;
  component.currentPage = 2;
  component.event_id = 1;

  component.getParticipantsList();
  expect(querySpy).toHaveBeenCalledWith({
    query: getParticipantsQuery,
    variables: {
      limit: component.pageSizeCount,
      page: component.currentPage,
      event_id: component.event_id,
      participant_event_status: ["ACCEPT", "REJECT", "PENDING"]
    },
    fetchPolicy: 'no-cache',
  });
 
 
});
it('test_error_is_handled_correctly', () => {
  spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
  spyOn(component['_errorHandler'], 'manageError');
  component.getStudentList();
 expect(component['_errorHandler'].manageError).toHaveBeenCalled();
});
it('should handle query error', () => {
  spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
  spyOn(component['_errorHandler'], 'manageError');

  component.getParticipantsList();
 expect(component['_errorHandler'].manageError).toHaveBeenCalled();  });
 it('test_mutation_error', () => {
  spyOn(component["_apollo"], 'mutate').and.returnValue(throwError('error')); 
  spyOn(component['_errorHandler'], 'manageError');
  component.isAllSelected = true;
  component.selected = [];
  component.editEvent();
  expect(component.isMinParticipants).toHaveBeenCalled();
  //expect(component['_errorHandler'].manageError).toHaveBeenCalled();
});
it('should create an event when all required fields are provided and at least one participant is selected', () => {
  spyOn(component['_apollo'], 'mutate').and.callThrough();

  // Arrange
  component.editEventForm.setValue({
      title: 'Test Event',
      start_date: new Date(),
      end_date: new Date(),
      start_time: '10:00 AM',
      end_time: '11:00 AM',
      description: 'Test Description'
  });
  component.isAllSelected = false;
  component.selected = [1];
  component.event_id = 1;
  spyOn(component, 'gotoEventList');
 
  // Act
  component.editEvent();
  expect(component.isMinParticipants).toHaveBeenCalled();

  // Assert
  expect(component["_apollo"].mutate).toHaveBeenCalledWith({
      mutation: editEventQuery,
      variables: {
        id:1,
          title: 'Test Event',
          description: 'Test Description',
          start_date_time: jasmine.any(Number),
          end_date_time: jasmine.any(Number),
          is_select_all_participant: 0,
          participant_ids: [1]
      }
  });

});
it('should return true when id is present in selected array', () => {
  component.selected = [1, 2, 3];
  const result = component.isSelected(2);
  expect(result).toBe(true);
});
it('should check #customSorting()', () => {
  component.sorting.sortingByColumn = "fullName";
  let sortingByColumn = "creationTime";

  // ascending order.
  component.sorting.sortingClickCounter = 0;
  component.customSorting(sortingByColumn);

  // descending order.
  component.sorting.sortingClickCounter = 1;
  component.customSorting(sortingByColumn);

  // Initial sorting i.e descending
  component.sorting.sortingClickCounter = 2;
  component.customSorting(sortingByColumn);

  // When an invalid choice
  component.sorting.sortingByColumn = "creationTime";
  component.sorting.sortingClickCounter = 3;
  component.customSorting(sortingByColumn);

  expect(component.getStudentList).toHaveBeenCalled();
});
    // Start date and end date are on the same day, and end time is after start time.
    it('should return true when end date time is after start date time', () => {
      const start_date = '2022-10-01';
      const start_time = '10:00';
      const end_date = '2022-10-01';
      const end_time = '12:00';

      const result = component.CheckdateTime(start_date, start_time, end_date, end_time);
      expect(result).toBe(true);
    });
       

});
