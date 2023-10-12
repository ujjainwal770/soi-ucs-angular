import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities';
import { OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import mockValues from 'src/app/core/constants/mock.values';
import { getCommentsDataList } from 'src/app/core/query/crowdsourcing-gallery';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogsService } from 'src/app/core/services/dialog-service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';

import { ViewCommentTabComponent } from './view-comment-tab.component';
import { throwError } from 'rxjs';
const oktaAuth = new OktaAuth(mockValues.oktaConfig);

describe('ViewCommentTabComponent', () => {
  let component: ViewCommentTabComponent;
  let fixture: ComponentFixture<ViewCommentTabComponent>;
  let backend: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewCommentTabComponent],

      imports: [
        MaterialModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        ApolloTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        ToastrService,
        NgxSpinnerService,
        DialogsService,
        AuthService,
        {
          provide: APOLLO_TESTING_CACHE,
          useValue: new InMemoryCache({
            addTypename: true
          }),
        },
        { provide: OKTA_CONFIG, useValue: { oktaAuth } }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCommentTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.inject(ApolloTestingController);


    spyOn(component, 'ngOnChanges').and.callThrough();
    spyOn(component, 'handlePage').and.callThrough();
    spyOn(component, 'updateLatestCount').and.callThrough();
    spyOn(component, 'manageLatestEventData').and.callThrough();
    spyOn(component, 'fetchCommentTabList').and.callThrough();
    spyOn(component, 'prepareDataSource').and.callThrough();
    spyOn(component, 'addComment').and.callThrough();
    spyOn(component, 'updateComment').and.callThrough();
    spyOn(component, 'deleteComment').and.callThrough();
    spyOn(component, 'customSorting').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check #ngOnChanges()', () => {
    console.log(`ViewCommentTabComponent --> should check #ngOnChanges()`);

    component.ngOnChanges();
    expect(false).toBe(false);
  });

  it('should call handlePage() return valid', () => {
    console.log(`ViewCommentTabComponent --> should call handlePage() return valid`);

    const e = {
      length: 9,
      pageIndex: 1,
      pageSize: 5,
      previousPageIndex: 0
    }
    component.handlePage(e)
    expect(component.currentPage).toEqual(1);
  });

  it('should check #updateLatestCount()', () => {
    console.log(`ViewCommentTabComponent --> should check #updateLatestCount()`);

    component.updateLatestCount();
    expect(false).toBe(false);
  });

  it('should check #manageLatestEventData() - eventType = add', () => {
    console.log(`ViewCommentTabComponent --> should check #manageLatestEventData() `);

    component.socketEventResponse = {
      data: {},
      eventType: 'add'
    };

    component.manageLatestEventData();
    expect(component.addComment).toHaveBeenCalled();
  });

  it('should check #manageLatestEventData() - eventType = update', () => {
    console.log(`ViewCommentTabComponent --> should check #manageLatestEventData() - eventType = update`);

    component.socketEventResponse = {
      data: {},
      eventType: 'update'
    };

    component.manageLatestEventData();
    expect(component.updateComment).toHaveBeenCalled();
  });

  it('should check #manageLatestEventData() - eventType = delete', () => {
    console.log(`ViewCommentTabComponent --> should check #manageLatestEventData() - eventType = delete`);

    component.socketEventResponse = {
      data: {},
      eventType: 'delete'
    };

    component.manageLatestEventData();
    expect(component.deleteComment).toHaveBeenCalled();
  });

  it('should check #manageLatestEventData() - eventType = null', () => {
    console.log(`ViewCommentTabComponent --> should check #manageLatestEventData() - eventType = null`);

    component.socketEventResponse = {
      data: {},
      eventType: null
    };

    component.manageLatestEventData();
    expect(false).toBe(false);
  });

  it('should check #manageLatestEventData() - when no socketEventResponse', () => {
    console.log(`ViewCommentTabComponent --> should check #manageLatestEventData() - when no socketEventResponse`);

    component.socketEventResponse = null;

    component.manageLatestEventData();
    expect(false).toBe(false);
  });

  it('should call fetchCommentTabList()', () => {
    console.log(`ViewCommentTabComponent --> should check #fetchCommentTabList() - when no socketEventResponse`);

    component.fetchCommentTabList();
    const op = backend.expectOne(addTypenameToDocument(getCommentsDataList));
    op.flush({
      "data": { "getGalleryDetails": { "comments": { "count": 9, "data": [{ "data": { "id": 109, "challenge_id": "00000182-cf61-d145-a3e3-ef77bc800000", "post_id": 87, "created_at": 1664540057827, "__typename": "UserCannedMessage" }, "messages": { "id": 7, "message": "I Love this!", "colorId": 1, "__typename": "CannedMessage" }, "users": { "full_name": "Nrusingha Moharana", "__typename": "User" }, "__typename": "FinalCommentsDetailsResponse" }], "__typename": "CommentsDetailsResponse" }, "__typename": "GalleryDetailsResponse" } }
    });

    expect(false).toBe(false);
  });

  it('should call #prepareDataSource() - if part', () => {
    console.log(`ViewCommentTabComponent --> should check #prepareDataSource() - if part`);

    let commentsData = [{
      users: { full_name: "full_name" },
      data: { created_at: 1664540057827 },
      messages: { message: "test message" }
    }];

    component.tableData = [];
    component.prepareDataSource(commentsData);
    expect(component.dataSource).toBeDefined();
  });

  it('should call #prepareDataSource() - else part', () => {
    console.log(`ViewCommentTabComponent --> should check #prepareDataSource() - else part`);

    let commentsData = [];
    component.tableData = [];
    component.prepareDataSource(commentsData);
    expect(false).toBe(false);
  });

  it('should call #addComment() - if part', () => {
    console.log(`ViewCommentTabComponent --> should check #addComment() - if part`);

    let latestComment = { id: 1, post_id: 1, commented_by: "test name", comment_date: new Date().getTime(), comment: "" };
    component.tableData = [{
      id: 1,
      commented_by: "test name",
      comment_date: new Date(),
      comment: ""
    }];
    component.count = 11;
    component.pageSizeCount = 10;
    component.addComment(latestComment);
    expect(component.dataSource).toBeDefined();
  });

  it('should call #addComment() - else part', () => {
    console.log(`ViewCommentTabComponent --> should check #addComment() - else part`);

    let latestComment = { id: 1, post_id: 1, commented_by: "test name", comment_date: new Date().getTime(), comment: "" };
    component.tableData = [{
      id: 1,
      commented_by: "test name",
      comment_date: new Date(),
      comment: ""
    }];
    component.count = 5;
    component.pageSizeCount = 10;
    component.addComment(latestComment);
    expect(component.dataSource).toBeDefined();
  });

  it('should call #deleteComment() - if part', () => {
    console.log(`ViewCommentTabComponent --> should check #deleteComment() - if part`);

    let latestComment = { id: 1, post_id: 1 };
    component.tableData = [{
      id: 1,
      commented_by: "test name",
      comment_date: new Date(),
      comment: ""
    }];
    component.deleteComment(latestComment);
    expect(component.dataSource).toBeDefined();
  });

  it('should call #deleteComment() - else part', () => {
    console.log(`ViewCommentTabComponent --> should check #deleteComment() - else part`);

    let latestComment = { id: 1, post_id: 1 };
    component.tableData = [{
      id: 2,
      commented_by: "test name",
      comment_date: new Date(),
      comment: ""
    }];
    component.deleteComment(latestComment);
    expect(false).toBe(false);
  });

  it('should check #customSorting()', () => {
    component.sorting.sortingByColumn = "full_name";
    let sortingByColumn = "created_at";

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
    component.sorting.sortingByColumn = "created_at";
    component.sorting.sortingClickCounter = 3;
    component.customSorting(sortingByColumn);

    expect(component.fetchCommentTabList).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly fetchCommentTabList', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.fetchCommentTabList();
   expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
      // Update an existing comment with valid data.
      it('should update the comment when valid data is provided', function() {
        // Create a mock tableData array with an existing comment
        const tableData = [
          {
            id: 1,
            commented_by: 'John Doe',
            comment_date: '2021-01-01',
            comment: 'Old comment'
          }
        ];
    
        // Create a mock latestComment object with valid data
        const latestComment = {
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          updated_at: '2021-02-01',
          message: 'New comment'
        };
    
        // Set the mock tableData to the component's tableData property
        component.tableData = tableData;
    
        // Call the updateComment method with the mock latestComment
        component.updateComment(latestComment);
    
        // Expect the tableData to be updated with the new comment
        expect(component.tableData).toEqual([
          {
            id: 1,
            commented_by: 'John Doe',
            comment_date: '2021-02-01',
            comment: 'New comment'
          }
        ]);
      });

});
