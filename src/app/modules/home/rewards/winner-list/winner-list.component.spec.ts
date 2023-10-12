import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
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
import { getRewardsWinnerList } from 'src/app/core/query/rewards';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { WinnerListComponent } from './winner-list.component';
import { throwError } from 'rxjs';
const oktaAuth = new OktaAuth(mockValues.oktaConfig);

describe('WinnerListComponent', () => {
  let component: WinnerListComponent;
  let fixture: ComponentFixture<WinnerListComponent>;
  let backend: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WinnerListComponent ],
      imports: [
        MaterialModule,
        RouterTestingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ApolloTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        ToastrService,
        UtilityService,
        NgxSpinnerService,
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
    fixture = TestBed.createComponent(WinnerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.inject(ApolloTestingController);
    spyOn(component, 'fetchWinnerList').and.callThrough();
    spyOn(component, 'handlePage').and.callThrough();
    spyOn(component, 'customSorting').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call handlePage() return valid', () => {
    const e = {
      length: 9,
      pageIndex: 1,
      pageSize: 5,
      previousPageIndex: 0
    }
    component.handlePage(e)
    expect(component.currentPage).toEqual(1);
  });

  it('should check #fetchWinnerList()', () => {
    component.fetchWinnerList();
    const op = backend.expectOne(addTypenameToDocument(getRewardsWinnerList));
    op.flush({
      "data":{"getRewardWinnerList":{"winner":[{"fullName":"Nrusingha  Moharana","rewardId":null,"email":"cefapi7012@datakop.com","resultDate":1661431516134,"schoolName":"St Jospehs New","title":"Video Chat with U.S. Youth Ambassador",'ucs_status':"yes", "__typename":"UsersRewardListResponse"}],"count":1,"__typename":"AdminRewardWinnerView"}}
    });
    expect(component.dataSource).toBeDefined();
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

    expect(component.fetchWinnerList).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly fetchWinnerList', () => {
    spyOn(component['_apollo'], 'watchQuery').and.returnValue({
      valueChanges: throwError('error'),
      ref: {
        variables: {},
      },
    } as any); 

    spyOn(component['_errorHandler'], 'manageError');
    component.fetchWinnerList();
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });

});
