import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventListComponent } from './event-list.component';
import { PageEvent } from '@angular/material/paginator';
import { cancelEventQuery, getCalendarEventsListQuery } from 'src/app/core/query/event-calendar';
import { Observable, of, throwError } from 'rxjs';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { MatTableModule } from '@angular/material/table';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { DialogsService } from 'src/app/core/services/dialog-service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { ApolloQueryResult } from '@apollo/client/core';

describe('EventListComponent', () => {
  let component: EventListComponent;
  let fixture: ComponentFixture<EventListComponent>;
  let _localStorage: LocalStorageService;
  let _dialogsService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventListComponent ],
      imports:[ MatTableModule,
        MaterialModule,
        ToastrModule.forRoot(),
        RouterTestingModule,
        BrowserAnimationsModule,        
        ApolloTestingModule,],
      providers:[LocalStorageService,
        DialogsService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    _localStorage = TestBed.inject(LocalStorageService);
    _dialogsService = TestBed.inject(DialogsService);
    router = TestBed.inject(Router);

    spyOn(component, 'getListEvent').and.callThrough();
    spyOn(component, 'cancelEvent').and.callThrough();
    spyOn(component, 'deleteEvent').and.callThrough();  

  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

    expect(component.getListEvent).toHaveBeenCalled();
  });
  it('should update page size and get broadcast messages on page event', () => {
    const event = { pageIndex: 1, pageSize: 10, length: 50 } as PageEvent;
    component.handlePage(event);
    expect(component.currentPage).toBe(1);
    expect(component.pageSizeCount).toBe(10);
    expect(component.getListEvent).toHaveBeenCalled();
  });
  it('should fetch getListEvent with correct query parameters', () => {
    spyOn(_localStorage, 'getSchoolAdminSchoolId').and.returnValue('1');
    const testData = {
      getCalendarEventListByEvent: {
        count: 5,
        event_list: [
          { id: 1, title: 'Event 1' ,start_date_time:new Date(),end_date_time:new Date()},
                ]
      }
    };

    spyOn(component['_apollo'], 'query').and.returnValue(of({ data: testData })as Observable<ApolloQueryResult<unknown>>);
    component.pageSizeCount = 20;
    component.currentPage = 2;

    component.getListEvent();
    expect(component['_apollo'].query).toHaveBeenCalledWith({
      query: getCalendarEventsListQuery,
      variables: {
        limit: component.pageSizeCount,
        page: component.currentPage,
        school_id: '1',
        local_time_zone_offset_in_minutes:((new Date()).getTimezoneOffset()  *-1),
        order_by: 'start_date_time',
        order: 'DESC'
      },
      fetchPolicy: 'no-cache',
    });
  });
  it('test_error_is_handled_correctly', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.getListEvent();
   expect(component['_errorHandler'].manageError).toHaveBeenCalled();
});
it('should call onRemoveActionClicked() - check when dialog response available', () => {
  let res = { "data": "data" };

  spyOn(_dialogsService, 'eventCancelDialogPopUp').and.returnValue(of(res));
  component.deleteEvent('1');
  fixture.detectChanges();
  expect(component.cancelEvent).toHaveBeenCalled();
});

     // Tests that addEvent successfully creates an event with all required fields and minimum one participant selected
    it('should cancel event', () => {
      spyOn(component['_apollo'], 'mutate').and.returnValue(of({}));

      // Arrange
      //component.selectedEvent = {id:'1'};
    
      // Act
      component.cancelEvent('1');

      // Assert
      expect(component["_apollo"].mutate).toHaveBeenCalledWith({
          mutation: cancelEventQuery,
          variables: {
            event_id:'1',
          }
      });
  });
  it('test_mutation_error', () => {
    spyOn(component["_apollo"], 'mutate').and.returnValue(throwError('error')); 
    spyOn(component['_errorHandler'], 'manageError');
    component.cancelEvent('1');
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  it('should call editEvent()', () => {
    let eventId = '367';
    const spy = spyOn(router, 'navigateByUrl');
    component.editEvent(eventId);
    const url = spy.calls.first().args[0];
    expect(url).toBe('/manage-events/edit-event/' + eventId);
  });
  it('should call copyEvent()', () => {
    let eventId = '367';
    const spy = spyOn(router, 'navigateByUrl');
    component.copyEvent(eventId);
    const url = spy.calls.first().args[0];
    expect(url).toBe('/manage-events/add-event/' + eventId);
  });
  // Emits 'eventAction' event when called
  it('should emit eventAction event when called', function() {
    spyOn(component.eventAction, 'emit');
    component.goBack();
    expect(component.eventAction.emit).toHaveBeenCalled();
  });
  it('should emit openDetails event when called', function() {
    spyOn(component.viewDetails, 'emit');
    component.openDetails({});
    expect(component.viewDetails.emit).toHaveBeenCalled();
  });
});
