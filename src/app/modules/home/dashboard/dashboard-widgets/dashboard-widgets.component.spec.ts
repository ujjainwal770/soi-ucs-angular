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
import gql from 'graphql-tag';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/core/services/http.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { DashboardWidgetsComponent } from './dashboard-widgets.component';

describe('DashboardWidgetsComponent', () => {
  let component: DashboardWidgetsComponent;
  let fixture: ComponentFixture<DashboardWidgetsComponent>;
  let backend: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardWidgetsComponent ],
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
       }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.get(ApolloTestingController);
    spyOn(component,'getAnalytics').and.callThrough();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  const soucsUserCountQuery = gql`
  {
    SoucsUserCountAnalytics{
      totalschools,
      totalactiveschools,
      totalusers,
      totalucsusers,
      totalguestusers
    }
  }
  `;
  it('should test getAnalytics', () => {
  
    const op = backend.expectOne(addTypenameToDocument(soucsUserCountQuery));
    component.getAnalytics()
    op.flush({"data":{"SoucsUserCountAnalytics":{"totalschools":115,"totalactiveschools":102,"totalusers":186,"totalucsusers":7,"totalguestusers":179,"__typename":"TotalCountDashboardResponse"}}});
    expect(component.card2contentValue1 ).toBeDefined();
    // backend.verify();
  });

});
