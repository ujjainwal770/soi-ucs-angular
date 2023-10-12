import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities/graphql/transform';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/core/services/http.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { schoolUSerCountQuery } from 'src/app/core/query/school-dashboard';
import { DashboardWidgetsSchoolComponent } from './dashboard-widgets-school.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('DashboardWidgetsSchoolComponent', () => {
  let component: DashboardWidgetsSchoolComponent;
  let fixture: ComponentFixture<DashboardWidgetsSchoolComponent>;
  let backend: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardWidgetsSchoolComponent ],
      imports:[
        RouterTestingModule,
        ToastrModule.forRoot(),
        HttpClientModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ApolloTestingModule,
        MaterialModule,
        FormsModule 
      ],
      providers:[ToastrService,HttpService,LocalStorageService,
        {
          provide: APOLLO_TESTING_CACHE,
          useValue: new InMemoryCache({
             addTypename: true
          }),
       }],
       schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardWidgetsSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.get(ApolloTestingController);
    spyOn(component,'getAnalyticsSchool').and.callThrough();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test getAnalyticsSchool', () => {
  
    const op = backend.expectOne(addTypenameToDocument(schoolUSerCountQuery));
    component.getAnalyticsSchool()
    op.flush({"data":{"getSchoolStudentCount":{"total_student_count":22,"pending_student_count":19,"__typename":"SchoolStudentCountResponse"}}}
    );
    expect(component.studentCount).toBeDefined();
    // backend.verify();
  });
});
