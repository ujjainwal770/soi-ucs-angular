import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities/graphql/transform';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import gql from 'graphql-tag';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/core/services/http.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';

import { DashboardSchoolsUsersComponent } from './dashboard-schools-users.component';

describe('DashboardSchoolsUsersComponent', () => {
  let component: DashboardSchoolsUsersComponent;
  let fixture: ComponentFixture<DashboardSchoolsUsersComponent>;
  let backend: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardSchoolsUsersComponent ],
      imports:[
        RouterTestingModule,
        ToastrModule.forRoot(),
        HttpClientModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ApolloTestingModule,
        MaterialModule,
        MatRadioModule,
        FormsModule 
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
    fixture = TestBed.createComponent(DashboardSchoolsUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.get(ApolloTestingController);
    spyOn(component,'getAnalytics').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  const soucsDashboardLeaderboardQuery = gql`{
    soucsDashboardLeaderboard{
      topschool{
        id,
        schoolName,
        stateName,
        cityName,
        totalpoints
      }
      topucsusers{
        user_id,
        first_name,
        last_name,
        stateName,
        school_id,
        totalpoints
      }
      topguestusers{
        user_id,
        first_name,
        last_name,
        stateName,
        cityName,
        totalpoints
      }
      ucsschools{
              id,
        schoolName
      }
    }
  }`
  it('should test getAnalytics', () => {
    // const op = backend.expectOne(schoolQuery);
   
    const op = backend.expectOne(addTypenameToDocument(soucsDashboardLeaderboardQuery));
    component.getAnalytics()
    op.flush({"data":{"soucsDashboardLeaderboard":{"topschool":[{"id":27,"schoolName":"St Jospehs New","stateName":"AL","cityName":"Alexender City","totalpoints":2350,"__typename":"School"},{"id":45,"schoolName":"Devikalay","stateName":"CA","cityName":"Aberdeen","totalpoints":200,"__typename":"School"},{"id":4,"schoolName":"School NameKumar","stateName":"FL","cityName":"School Name","totalpoints":0,"__typename":"School"},{"id":6,"schoolName":"Thomas 3","stateName":"FM","cityName":"New york","totalpoints":0,"__typename":"School"},{"id":7,"schoolName":"Thomas 4","stateName":"CA","cityName":"New york","totalpoints":0,"__typename":"School"},{"id":8,"schoolName":"Test School 2 ","stateName":"CA","cityName":"New york","totalpoints":0,"__typename":"School"},{"id":10,"schoolName":"Modern School","stateName":"HI","cityName":"NEVADA","totalpoints":0,"__typename":"School"},{"id":11,"schoolName":"ABC School","stateName":"AK","cityName":"Germantown","totalpoints":0,"__typename":"School"},{"id":12,"schoolName":"sdf","stateName":"CA","cityName":"San Diego","totalpoints":0,"__typename":"School"},{"id":13,"schoolName":"govt school","stateName":"CA","cityName":"San Diego","totalpoints":0,"__typename":"School"}],"topucsusers":[{"user_id":59,"first_name":"Nrusingha ","last_name":"Moharana","stateName":null,"school_id":27,"totalpoints":7600,"__typename":"User"},{"user_id":259,"first_name":"Mercy Swamy","last_name":"Yoganathan","stateName":null,"school_id":45,"totalpoints":200,"__typename":"User"},{"user_id":15,"first_name":"Fname","last_name":"lname","stateName":null,"school_id":45,"totalpoints":0,"__typename":"User"},{"user_id":18,"first_name":"Somen","last_name":"Da","stateName":null,"school_id":45,"totalpoints":0,"__typename":"User"},{"user_id":21,"first_name":"Rahul","last_name":"Maheshwari","stateName":null,"school_id":45,"totalpoints":0,"__typename":"User"},{"user_id":22,"first_name":"Mercy","last_name":"Testing","stateName":null,"school_id":45,"totalpoints":0,"__typename":"User"},{"user_id":23,"first_name":"Abdul","last_name":"Hamid","stateName":null,"school_id":45,"totalpoints":0,"__typename":"User"},{"user_id":165,"first_name":"Test","last_name":"User One","stateName":null,"school_id":26,"totalpoints":0,"__typename":"User"},{"user_id":233,"first_name":"Dashboard","last_name":"106","stateName":null,"school_id":45,"totalpoints":0,"__typename":"User"}],"topguestusers":[{"user_id":193,"first_name":"Nr","last_name":"Singha","stateName":"CA","cityName":"Kolkata","totalpoints":500,"__typename":"User"},{"user_id":196,"first_name":"Nru","last_name":"Singh","stateName":"AL","cityName":"Bhubaneswar","totalpoints":400,"__typename":"User"},{"user_id":194,"first_name":"Non UCS","last_name":"Test User","stateName":"CA","cityName":"LasVagus","totalpoints":200,"__typename":"User"},{"user_id":125,"first_name":"Ram","last_name":"Narayana","stateName":"AL","cityName":"Mountan View","totalpoints":0,"__typename":"User"},{"user_id":131,"first_name":"Nrusingha ","last_name":"Moh","stateName":"AS","cityName":"Bbsr ","totalpoints":0,"__typename":"User"},{"user_id":144,"first_name":"","last_name":"","stateName":null,"cityName":null,"totalpoints":0,"__typename":"User"},{"user_id":145,"first_name":"","last_name":"","stateName":null,"cityName":null,"totalpoints":0,"__typename":"User"},{"user_id":146,"first_name":"","last_name":"","stateName":null,"cityName":null,"totalpoints":0,"__typename":"User"},{"user_id":147,"first_name":"rm_fname","last_name":"rm_lname","stateName":"CA","cityName":"Alabama","totalpoints":0,"__typename":"User"},{"user_id":150,"first_name":"Nm","last_name":"Moharana ","stateName":"DE","cityName":"Abcdefg","totalpoints":0,"__typename":"User"}],"ucsschools":[{"id":26,"schoolName":"pp school","__typename":"School"},{"id":27,"schoolName":"St Jospehs New","__typename":"School"},{"id":45,"schoolName":"Devikalay","__typename":"School"}],"__typename":"LeaderboardDashboardResponse"}}}
);
    expect(component.top10GuestdataSource).toBeDefined();
    // backend.verify();
  });
});
