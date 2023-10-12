import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities/graphql/transform';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { ChartsModule } from 'ng2-charts';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { schoolDashboardLeaderboardQuery } from 'src/app/core/query/school-dashboard';
import { HttpService } from 'src/app/core/services/http.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';

import { SchoolDashboardDataComponent } from './school-dashboard-data.component';

describe('SchoolDashboardDataComponent', () => {
  let component: SchoolDashboardDataComponent;
  let fixture: ComponentFixture<SchoolDashboardDataComponent>;
  let backend: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolDashboardDataComponent ],
      imports:[
        RouterTestingModule,
        ToastrModule.forRoot(),
        HttpClientModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ApolloTestingModule,
        MaterialModule,
        MatRadioModule,
        FormsModule ,
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
    fixture = TestBed.createComponent(SchoolDashboardDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.inject(ApolloTestingController);
    spyOn(component, 'getTopSchoolsAndStudents').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should check getTopSchoolsAndStudents()", () => {
    component.getTopSchoolsAndStudents();
    const op = backend.expectOne(addTypenameToDocument(schoolDashboardLeaderboardQuery));
    op.flush({
      "data":{"schoolAdminDashboardLeaderboard":{"topusers":[{"user_id":257,"school_id":45,"full_name":"Deepali Test","email":"deepalitest101@yopmail.com","stateName":null,"totalpoints":1100,"__typename":"User"}],"topschool":{"schools":[{"id":45,"schoolName":"Devikalay","stateName":"CA","cityName":"Aberdeen","totalpoints":6400,"__typename":"School"}],"rank":1,"__typename":"SchoolLeaderboardResponse"},"__typename":"SchoolLeaderboardDashboardResponse"}}
    });
  });
});
