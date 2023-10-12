import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities/graphql/transform';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import gql from 'graphql-tag';
import { ChartsModule } from 'ng2-charts';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/core/services/http.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';

import { MonthlyRegistrationComponent } from './monthly-registration.component';

describe('MonthlyRegistrationComponent', () => {
  let component: MonthlyRegistrationComponent;
  let fixture: ComponentFixture<MonthlyRegistrationComponent>;
  let backend: ApolloTestingController;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonthlyRegistrationComponent],
      imports: [
        RouterTestingModule,
        ToastrModule.forRoot(),
        HttpClientModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ApolloTestingModule,
        MaterialModule,
        FormsModule,
        ChartsModule
      ],
      providers: [ToastrService, HttpService, LocalStorageService,
        {
          provide: APOLLO_TESTING_CACHE,
          useValue: new InMemoryCache({
            addTypename: true
          }),
        }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.get(ApolloTestingController);
    spyOn(component, 'getAnalytics').and.callThrough();
  });
  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  const soucsMonthlyRegQuery = gql`
    query monthalyRegistrationSoucs($input:Float!){
      monthalyRegistrationSoucs(year:$input){
        month,
        ucs,
        public
      }
    }`;
  it('should test getAnalytics', () => {
    const op = backend.expectOne(addTypenameToDocument(soucsMonthlyRegQuery));
    component.selectedYearRange = new Date().getFullYear();
    component.getAnalytics(component.selectedYearRange)
    op.flush({ "data": { "monthalyRegistrationSoucs": [{ "month": 1, "ucs": 49, "public": 7, "__typename": "MonthCountDashboardResponse" }, { "month": 2, "ucs": 25, "public": 8, "__typename": "MonthCountDashboardResponse" }, { "month": 3, "ucs": 0, "public": 0, "__typename": "MonthCountDashboardResponse" }, { "month": 4, "ucs": 0, "public": 0, "__typename": "MonthCountDashboardResponse" }, { "month": 5, "ucs": 0, "public": 0, "__typename": "MonthCountDashboardResponse" }, { "month": 6, "ucs": 0, "public": 0, "__typename": "MonthCountDashboardResponse" }, { "month": 7, "ucs": 0, "public": 0, "__typename": "MonthCountDashboardResponse" }, { "month": 8, "ucs": 0, "public": 0, "__typename": "MonthCountDashboardResponse" }, { "month": 9, "ucs": 0, "public": 0, "__typename": "MonthCountDashboardResponse" }, { "month": 10, "ucs": 0, "public": 0, "__typename": "MonthCountDashboardResponse" }, { "month": 11, "ucs": 0, "public": 0, "__typename": "MonthCountDashboardResponse" }, { "month": 12, "ucs": 0, "public": 0, "__typename": "MonthCountDashboardResponse" }] } });
    expect(component.barChartOptions).toBeDefined();
    backend.verify();
  });
});
