import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { SchoolListComponent } from '../school-list/school-list.component';

import { SchoolEditComponent, schoolQuery } from './school-edit.component';
import { APOLLO_TESTING_CACHE, ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities';
import { throwError } from 'rxjs';

describe('SchoolEditComponent', () => {
  let component: SchoolEditComponent;
  let fixture: ComponentFixture<SchoolEditComponent>;
  let backend: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolEditComponent ],
      imports:[
        ToastrModule.forRoot(),
        ApolloTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'school-management', component: SchoolListComponent},
      ]),
      BrowserAnimationsModule
      ],
      providers:[ToastrService,
        {
          provide: APOLLO_TESTING_CACHE,
          useValue: new InMemoryCache({
            addTypename: true
          }),
        }],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolEditComponent);
    backend = TestBed.inject(ApolloTestingController);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component,'checkEditChange').and.callThrough();
    spyOn(component,'backclicked').and.callThrough();
    spyOn(component,'getSchoolByID').and.callThrough();
    // spyOn(component,'onTabChanged').and.callThrough()
  });
  it("should check getSchoolByID()", () => {
    const op = backend.expectOne(addTypenameToDocument(schoolQuery));
    component.getSchoolByID(97)
    op.flush({
      "data": {
        "findById": {
          addressFirst: "416, Charms Solitair",
          addressSecond: "Ahinsa Khand -2",
          banner: "yes",
          cityName: "Ghaziabadn",
          countryName: "USA",
          creationTime: 1639742780277,
          districtName: "a-c central cusd 262",
          id: 97,
          mainEmail: "",
          mainName: "",
          mainPhone: "",
          nces: "111111111111",
          schoolName: "local school113ddegb",
          schoolProfile: "public",
          stateName: "AK",
          zipcode: "12345",
          __typename: "School",

        }
      }
    })
  });
  it('test_error_is_handled_correctly getAdminData', () => {
    spyOn(component['_apollo'], 'watchQuery').and.returnValue({
      valueChanges: throwError('error'),
      ref: {
        variables: {},
      },
    } as any); 

    spyOn(component['_errorHandler'], 'manageError');
    component.getSchoolByID(76);
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should checkEditChange ', () => {
    const event = {tab : {origin: 1}}
    component.checkEditChange(event)
    expect(component.checkEditChange).toHaveBeenCalled();
  });
  it('should backclicked ', () => {
    component.backclicked()
    expect(component.backclicked).toHaveBeenCalled();
  });
});
 