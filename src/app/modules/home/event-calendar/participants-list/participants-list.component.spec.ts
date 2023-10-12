import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ParticipantsListComponent } from './participants-list.component';
import { ActivatedRoute } from '@angular/router';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { of, throwError } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { getParticipantsListQuery } from 'src/app/core/query/event-calendar';
import { ApolloQueryResult, NetworkStatus } from '@apollo/client/core';
import { HttpService } from 'src/app/core/services/http.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('ParticipantsListComponent', () => {
  let component: ParticipantsListComponent;
  let fixture: ComponentFixture<ParticipantsListComponent>;
  let mockActivatedRoute;



  beforeEach(async () => {
    mockActivatedRoute = { params: of({ id: '1' }) };

    await TestBed.configureTestingModule({
      declarations: [ ParticipantsListComponent ],
      imports: [
        MatTableModule,
        ToastrModule.forRoot(),
        ApolloTestingModule,
        RouterTestingModule
      ],
      providers: [
        HttpService, ToastrService, NgxSpinnerService,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
       
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component, 'getParticipantsList').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch participants list on init', () => {
    component.ngOnInit();
    expect(component.getParticipantsList).toHaveBeenCalled();

  });

  it('should update page size and fetch participants list on page event', () => {
    const event: PageEvent = { pageIndex: 1, pageSize: 10, length: 50 };
    component.handlePage(event);
    expect(component.currentPage).toBe(1);
    expect(component.pageSizeCount).toBe(10);
  });

  it('should fetch participants list with correct query parameters', () => {
    const querySpy = spyOn(component['_apollo'], 'query').and.callThrough();

    component.pageSizeCount = 20;
    component.currentPage = 2;

    component.getParticipantsList();
    expect(querySpy).toHaveBeenCalledWith({
      query: getParticipantsListQuery,
      variables: {
        limit: component.pageSizeCount,
        page: component.currentPage,
        event_id: component.eventId,
        participant_event_status: ["ACCEPT", "REJECT", "PENDING"],
        order_by:'creation_time',
        order:'DESC'
      },
      fetchPolicy: 'no-cache',
    });
  });

  it('should handle query success', () => {

    const mockData:ApolloQueryResult<any> = {
      data: {
        getSchoolEventActiveUserForAdmin: {
          participant_list: [
          ],
          count: 0
        }
      },
      loading: false,
      networkStatus: NetworkStatus.ready
    };
    spyOn(component['_apollo'], 'query').and.returnValue(of(mockData));
    component.getParticipantsList();
    expect(component.count).toBe(0);
    expect(component.dataSource.data).toEqual(mockData.data.getSchoolEventActiveUserForAdmin.participant_list);
  });

  it('should handle query error', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');

    component.getParticipantsList();
   expect(component['_errorHandler'].manageError).toHaveBeenCalled();  });

       // eventId is not provided
       it('should set eventId to 0 when params.event_id is not provided', function() {
        // Arrange
        spyOn(component['_activateRouter'].params, 'subscribe').and.callThrough();
  
        // Act
        component.ngOnInit();
  
        // Assert
        expect(component.eventId).toBe(0);
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
      
        expect(component.getParticipantsList).toHaveBeenCalled();
      });
      
 });
