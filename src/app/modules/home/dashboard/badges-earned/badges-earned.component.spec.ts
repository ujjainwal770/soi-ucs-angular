import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities/graphql/transform';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import gql from 'graphql-tag';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/core/services/http.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { BadgesEarnedComponent } from './badges-earned.component';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { ChartsModule } from 'ng2-charts';

describe('BadgesEarnedComponent', () => {
  let component: BadgesEarnedComponent;
  let fixture: ComponentFixture<BadgesEarnedComponent>;
  let backend: ApolloTestingController;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BadgesEarnedComponent ],
      imports:[
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
      providers:[ToastrService,HttpService,LocalStorageService,
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
    fixture = TestBed.createComponent(BadgesEarnedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.get(ApolloTestingController);
    spyOn(component,'getAnalytics').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  const soucsBadgesQuery = gql `
  {
    InclusionBadgeSoucsDashboard{
      badge,
      count,
      percent
    }
  }`;
  it('should test getAnalytics', () => {  
    const op = backend.expectOne(addTypenameToDocument(soucsBadgesQuery));
    component.getAnalytics()
    op.flush({
      "data": {
        "InclusionBadgeSoucsDashboard": [
          {
            "badge": "rookie",
            "count": 19,
            "percent":"1%"
          },
          {
            "badge": "hall of famer",
            "count": 21,
            "percent":"12%"
          },
          {
            "badge": "captain",
            "count": 3,
            "percent":"51%"
          },
          {
            "badge": "champion",
            "count": 8,
            "percent":"41%"
          },
          {
            "badge": "pro",
            "count": 58,
            "percent":"31%"
          }
        ]
      }
    });
    expect(component.pieChartData).toBeDefined();
    backend.verify();
  });

});
