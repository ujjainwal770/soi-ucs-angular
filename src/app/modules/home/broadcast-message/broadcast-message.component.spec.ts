import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadcastMessageComponent } from './broadcast-message.component';
import { MatTableModule } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { getBroadcastMessageList } from 'src/app/core/query/broadcast-message';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EditBroadcastMessageComponent } from './edit-broadcast-message/edit-broadcast-message.component';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/core/services/shared.service';
import { Observable, of, throwError } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client/core';
import { MatSort } from '@angular/material/sort';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('BroadcastMessageComponent', () => {
  let component: BroadcastMessageComponent;
  let fixture: ComponentFixture<BroadcastMessageComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BroadcastMessageComponent ],
      imports: [
        MatTableModule,
        RouterTestingModule.withRoutes([
          { path: 'edit-broadcast-message', component: EditBroadcastMessageComponent }
        ]),
        ToastrModule.forRoot(),
        ApolloTestingModule,
      ],
      providers: [
        ToastrService,
        ],       
         schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BroadcastMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component, 'gotoEditPage').and.callThrough();
    spyOn(component, 'getBroadCastMessages').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should fetch broadcast messages on init', () => {
    component.ngOnInit();
    expect(component.getBroadCastMessages).toHaveBeenCalled();
  });

  it('should update page size and get broadcast messages on page event', () => {
    const event = { pageIndex: 1, pageSize: 10, length: 50 } as PageEvent;
    component.handlePage(event);
    expect(component.currentPage).toBe(1);
    expect(component.pageSizeCount).toBe(10);
    expect(component.getBroadCastMessages).toHaveBeenCalled();
  });

  it('should fetch broadcast messages with correct query parameters', () => {
    spyOn(component['_apollo'], 'query').and.callThrough();
    component.pageSizeCount = 20;
    component.currentPage = 2;

    component.getBroadCastMessages();
    expect(component['_apollo'].query).toHaveBeenCalledWith({
      query: getBroadcastMessageList,
      variables: {
        limit: component.pageSizeCount,
        page: component.currentPage,
        orderBy: 'publish_date',
        order: 'DESC'
      },
      fetchPolicy: 'no-cache',
    });
  });
  it('should navigate to view page on gotoViewPage', () => {
    const routerSpy = spyOn(component['_router'], 'navigateByUrl');
    const id = '456';

    component.gotoViewPage(id);

    expect(routerSpy).toHaveBeenCalledWith('/manage-broadcast-message/view-broadcast-message/' + id);
  });
  it('should navigate to edit page on gotoEditPage', () => {
    const routerSpy = spyOn(component['_router'], 'navigateByUrl');
    const id = '123';

    component.gotoEditPage(id);

    expect(routerSpy).toHaveBeenCalledWith('/manage-broadcast-message/edit-broadcast-message/' + id);
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

    expect(component.getBroadCastMessages).toHaveBeenCalled();
  });
      // Tests that the query returns data and populates the data source
      it('test_query_returns_data', async () => {
        component.sort = new MatSort();
        const mockData = {
            data: {
                getBroadcastMessageList: {
                    broadcastMessage: [
                        {
                            id: '1',
                            message: 'test message',
                            publish_date: '2022-01-01',
                            expiration_date: '2022-01-02',
                            status: 'published'
                        }
                    ],
                    count: 1
                }
            }
        };
        spyOn(component['_apollo'], 'query').and.returnValue(of(mockData)as Observable<ApolloQueryResult<unknown>>);
        await component.getBroadCastMessages();
          expect(component.count).toBe(1);
    });
    it('test_error_is_handled_correctly', () => {
      spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
      spyOn(component['_errorHandler'], 'manageError');
      component.getBroadCastMessages();
     expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
});
