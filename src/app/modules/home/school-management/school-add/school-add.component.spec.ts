import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { SchoolService } from 'src/app/core/services/school.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { SchoolListComponent } from '../school-list/school-list.component';
import { SchoolAddComponent } from './school-add.component';
import { of } from 'rxjs';

describe('SchoolAddComponent', () => {
  let component: SchoolAddComponent;
  let fixture: ComponentFixture<SchoolAddComponent>;
  let _schoolService : SchoolService;
  let router: Router; 
  beforeEach( () => {
     TestBed.configureTestingModule({
      declarations: [ SchoolAddComponent
      ],
      imports:[
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ApolloTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'school-management', component: SchoolListComponent}
      ])
      ],
      providers:[ToastrService,SchoolService,
        {
          provide: APOLLO_TESTING_CACHE,
          useValue: new InMemoryCache({
             addTypename: true
          }),
       },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    _schoolService = TestBed.inject(SchoolService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    fixture.destroy();
    TestBed.resetTestingModule();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should backclicked', () => {
    const spy = spyOn(router, 'navigate');
    component.backclicked();
    const url = spy.calls.first().args[0];
    expect(url[0]).toBe('/school-management');
  });

  it('#getData should return expected data', () => {
    const expectedData= {text : {tabchange:1}}
    // _schoolService = TestBed.get(_schoolService);
    _schoolService.getMessage().subscribe(data => {
      expect(data).toEqual(expectedData);
      // done();
    });
 
  });
      // Tests that the subscription is unsubscribed
      it('should unsubscribe the subscription', () => {
        const spy = spyOn(component.subscription, 'unsubscribe');
        component.ngOnDestroy();
        expect(spy).toHaveBeenCalled();
    });
        // Tests that selecting a type sets the selectedType property to the given type
        it('test_select_type_sets_selected_type', () => {
          component.selectType('test');
          expect(component.selectedType).toEqual('test');
      });
          // Tests that demo1TabIndex and displayTab are updated correctly when a valid message is received
    it('test_valid_message_updates_demo1TabIndex_and_displayTab', () => {
      const message = {
          text: {
              tabchange: 1,
              tabDisplay: true
          }
      };
      spyOn(_schoolService, 'getMessage').and.returnValue(of(message));
      fixture = TestBed.createComponent(SchoolAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
      expect(component.demo1TabIndex).toBe(1);
      expect(component.displayTab).toBe(true);
  });
});
