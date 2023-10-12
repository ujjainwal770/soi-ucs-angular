import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EventCalendarComponent } from './event-calendar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { ParticipantsListComponent } from './participants-list/participants-list.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { Apollo } from 'apollo-angular';
import { Observable, of, throwError } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client/core';
import { DialogsService } from 'src/app/core/services/dialog-service';
import { cancelEventQuery } from 'src/app/core/query/event-calendar';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
describe('EventCalendarComponent', () => {
  let component: EventCalendarComponent;
  let fixture: ComponentFixture<EventCalendarComponent>;
  let _dialogsService;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EventCalendarComponent],
      imports: [
        MaterialModule,
        RouterTestingModule.withRoutes([
          { path: 'manage-events/participants', component: ParticipantsListComponent }
        ]),
        CalendarModule.forRoot({
          provide: DateAdapter,
          useFactory: adapterFactory
        }),
        ToastrModule.forRoot(),
        ApolloTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        BsModalService,
        DialogsService,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    _dialogsService = TestBed.inject(DialogsService);
    router = TestBed.inject(Router);

    spyOn(component, 'getCalendarEvents').and.callThrough();
    spyOn(component, 'cancelEvent').and.callThrough();
    spyOn(component, 'deleteEvent').and.callThrough();  
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should fetch calendar events on init', () => {
  //   const mockApollo = TestBed.inject(Apollo); // Get Apollo service
  //   spyOn(mockApollo, 'query').and.returnValue(of({
  //     data: {
  //       getCalendarEventViewForAdmin: {
  //         event_view: [
  //           {
  //             event_list: [
  //               {
  //                 id: '1',
  //                 start_date_time: new Date().toISOString(),
  //                 end_date_time: new Date().toISOString(),
  //                 title: 'Test Event',
  //                 description: 'Event description',
  //                 is_completed: false
  //               }
  //             ]
  //           }
  //         ]
  //       }
  //     }
  //   }));

  //   component.ngOnInit();
  //   expect(mockApollo.query).toHaveBeenCalled();
  //   expect(component.events.length).toBe(1);
  //   expect(component.events[0].title).toBe('Test Event');
  //   // ... Add additional expectations based on your component logic
  // });

  it('should handle calendar events query error on init', () => {
    const mockApollo = TestBed.inject(Apollo); // Get Apollo service
    spyOn(mockApollo, 'query').and.returnValue(throwError('error'));

    component.ngOnInit();
    expect(mockApollo.query).toHaveBeenCalled();
    // ... Add expectations for error handling
  });

  it('should open modal and fetch participants', () => {
    const mockModalService = TestBed.inject(BsModalService); // Get modal service
    const mockEvent = {
      id: '1',
      title: 'Test Event'
      // ... Other properties
    };
    spyOn(mockModalService, 'show').and.returnValue({
      content: { getParticipants: jasmine.createSpy('getParticipants') }
    } as any);

    component.openModal(null, mockEvent);
    expect(mockModalService.show).toHaveBeenCalled();
    expect(component.selectedEvent).toEqual(mockEvent);
    // ... Add expectations for participant fetching
  });
  it('should handle query error', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');

    component.getCalendarEvents('08','2023');
   expect(component['_errorHandler'].manageError).toHaveBeenCalled();  });

   it('should handle query error', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');

    component.getParticipants({id:'1'});
   expect(component['_errorHandler'].manageError).toHaveBeenCalled();  });

   it('test closeOpenMonthViewDay', () => {
    component.closeOpenMonthViewDay();
   expect(component.activeDayIsOpen).toBeFalse();  
  });

  it('should navigate to goToParticipantsList', () => {
    const routerSpy = spyOn(component['_router'], 'navigateByUrl');
    const id = '123';

    component.goToParticipantsList(id);

    expect(routerSpy).toHaveBeenCalledWith('/manage-events/participants/' + id);
  });
  it('test DateChange', () => {
    
    component.DateChange(new Date());

    expect(component.getCalendarEvents).toHaveBeenCalled();
  });
     
      // Tests that method handles events with additional properties
      it('should create an event object with only relevant properties when event has additional properties', () => {
        const input = [
            {
                event_list: [
                    {
                        start_date_time: '2022-01-01T00:00:00.000Z',
                        end_date_time: '2022-01-02T00:00:00.000Z',
                        title: 'Test Event',
                        description: 'Test Description',
                        is_completed: true,
                        extra_property: 'Extra'
                    }
                ]
            }
        ];
        component.covertData(input);
        expect(component.events).toEqual([
            {
                id: undefined,
                is_completed: true,
                start: new Date('2022-01-01T00:00:00.000Z'),
                end: new Date('2022-01-02T00:00:00.000Z'),
                title: 'Test Event',
                description: 'Test Description',
                allDay: true,
                resizable: {
                    beforeStart: true,
                    afterEnd: true
                },
                draggable: true
            }
        ]);
    });
    it('test_query_returns_data', async () => {
      const mockData = {
          data: {
            getSchoolEventActiveUserForAdmin: {
              participant_list: [
                      {
                          id: '1',
                          full_name: 'test name',
                          email: 'test@gmail.com',
                          
                      }
                  ],
                  count: 1
              }
          }
      };
      spyOn(component['_apollo'], 'query').and.returnValue(of(mockData)as Observable<ApolloQueryResult<unknown>>);
      await component.getParticipants({id:'1'});
       // expect(component.count).toBe(1);
  });
  it('test_query_returns_data calendar query', async () => {
    const mockData = {
        data: {
          getCalendarEventViewForAdmin: {
            event_view: {
              count: 1,
              event_list:[  {
                        id: '1',
                        title: 'test event',
                        description: 'test description',
                        
                    }]
                  },
               
            }
        }
    };
    spyOn(component['_apollo'], 'query').and.returnValue(of(mockData)as Observable<ApolloQueryResult<unknown>>);
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
      spyOn(component['_apollo'], 'mutate').and.callThrough();

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
  
      // Should update the 'eventView' property with the passed view parameter.
      it('should update the eventView property with the passed view parameter', function() {
        const view = 'month';
        component.updateView(view);
        expect(component.eventView).toEqual(view);
      });
      it('should update page size and fetch participants list on page event', () => {
        const event: PageEvent = { pageIndex: 1, pageSize: 10, length: 50 };
        component.handlePage(event);
        expect(component.currentPage).toBe(1);
        expect(component.pageSizeCount).toBe(10);
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
          // Sets 'listDate' to undefined
    it('should set listDate to undefined', function() {
      component.listDate = new Date();
      component.action();
      expect(component.listDate).toBeUndefined();
    });
        // Should set the 'listDate' property to the input 'viewDate'
        it('should set the listDate property when viewDate is provided', function() {
          // Arrange
          const viewDate = new Date();
    
          // Act
          component.openEventList(viewDate);
    
          // Assert
          expect(component.listDate).toEqual(viewDate);
        });
});
