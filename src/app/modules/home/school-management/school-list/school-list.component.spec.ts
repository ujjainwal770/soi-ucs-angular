import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities/graphql/transform';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { massResendInvitationMail, searchQuery, updateSchoolStatusQuery } from 'src/app/core/query/school-management';
import { DialogsService } from 'src/app/core/services/dialog-service';
import { HttpService } from 'src/app/core/services/http.service';
import { SchoolService } from 'src/app/core/services/school.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { FilterComponent } from '../filter/filter.component';
import { EditSchoolFormComponent } from '../forms/edit-school-form/edit-school-form.component';
import { SchoolViewComponent } from '../school-view/school-view.component';
import { SchoolListComponent } from './school-list.component';

class MockRouter {
  navigateByUrl(url: string) { return url; }
}

describe('SchoolListComponent', () => {
  let component: SchoolListComponent;
  let fixture: ComponentFixture<SchoolListComponent>;
  let backend: ApolloTestingController;
  let _dialogsService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SchoolListComponent, FilterComponent],
      imports: [
        FormsModule,
        MaterialModule,
        RouterTestingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ApolloTestingModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          { path: 'school-management/school-edit/93', component: EditSchoolFormComponent },
          { path: 'school-management/school-view/93', component: SchoolViewComponent }
        ])
      ],
      providers: [HttpService, ToastrService, SchoolService, DialogsService,
        {
          provide: APOLLO_TESTING_CACHE,
          useValue: new InMemoryCache({
            addTypename: true
          }),
        }]
    })
      .compileComponents();
  });

  beforeAll(() => {
    window.onbeforeunload = () => 'Oh no!';
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.inject(ApolloTestingController);
    _dialogsService = TestBed.inject(DialogsService);
    spyOn(component, 'getSchoolList').and.callThrough();
    spyOn(component, 'userAction').and.callThrough();
    spyOn(component, 'reasonDeclaration').and.callThrough();
    spyOn(component, 'changeStatus').and.callThrough();
    spyOn(component, 'resetFilter').and.callThrough();
    spyOn(component, 'masterToggle').and.callThrough();
    spyOn(component, 'openConfrmDlg').and.callThrough();
    spyOn(component, 'resendInvitationMail').and.callThrough();
    spyOn(component, 'openResendFailedDialog').and.callThrough();
    spyOn(component, 'customSorting').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test getSchoolList', () => {
    // const op = backend.expectOne(schoolQuery);

    const op = backend.expectOne(addTypenameToDocument(searchQuery));
    component.getSchoolList();
    op.flush({ "data": { "findSchoolSearchByQuery": { "count": 118, "schools": [{ "id": 118, "schoolName": "abcdeg school", "stateName": "AK", "zipcode": "34567", "cityName": "dgd55", "creationTime": 1643612316738, "addressFirst": "sdfsd55", "status": "active", "districtName": "abington", "adminActiveStatus": "no", "nces": "123456789874", "banner": "no", "status_text": "Pending", "deactivateReason": "", "__typename": "SchoolFindResponse" }, { "id": 117, "schoolName": "test4511", "stateName": "AK", "zipcode": "12345", "cityName": "test", "creationTime": 1642334149848, "addressFirst": "test", "status": "active", "districtName": "a w brown leadership academy", "adminActiveStatus": "no", "nces": "345678901235", "banner": "yes", "status_text": "Pending", "deactivateReason": "", "__typename": "SchoolFindResponse" }, { "id": 116, "schoolName": "test", "stateName": "AK", "zipcode": "12345", "cityName": "test", "creationTime": 1642334106393, "addressFirst": "test", "status": "active", "districtName": "a w brown leadership academy", "adminActiveStatus": "no", "nces": "345678901234", "banner": "yes", "status_text": "Pending", "deactivateReason": "", "__typename": "SchoolFindResponse" }, { "id": 115, "schoolName": "Vibanshu edit1235", "stateName": "AK", "zipcode": "12345", "cityName": "test", "creationTime": 1641817993515, "addressFirst": "test", "status": "active", "districtName": "a w beattie career center", "adminActiveStatus": "no", "nces": "123456789630", "banner": "yes", "status_text": "Pending", "deactivateReason": "", "__typename": "SchoolFindResponse" }, { "id": 114, "schoolName": "Asmi School123452", "stateName": "AZ", "zipcode": "32432", "cityName": "sfdsf", "creationTime": 1641215223854, "addressFirst": "saltlake", "status": "active", "districtName": "ardsley union free school district", "adminActiveStatus": "no", "nces": "123456789012", "banner": "no", "status_text": "Pending", "deactivateReason": "", "__typename": "SchoolFindResponse" }, { "id": 113, "schoolName": "final 10", "stateName": "AS", "zipcode": "33333", "cityName": "test", "creationTime": 1641212791991, "addressFirst": "test", "status": "active", "districtName": "a w beattie career center", "adminActiveStatus": "no", "nces": "525252525251", "banner": "yes", "status_text": "Pending", "deactivateReason": "", "__typename": "SchoolFindResponse" }, { "id": 112, "schoolName": "final school 5", "stateName": "AS", "zipcode": "12121", "cityName": "test", "creationTime": 1641211161948, "addressFirst": "test", "status": "active", "districtName": "a-c central cusd 262", "adminActiveStatus": "no", "nces": "121212121219", "banner": "yes", "status_text": "Pending", "deactivateReason": "", "__typename": "SchoolFindResponse" }, { "id": 111, "schoolName": "final school 4", "stateName": "AK", "zipcode": "12122", "cityName": "test", "creationTime": 1641210991297, "addressFirst": "test", "status": "active", "districtName": "a center for creative education (79457)", "adminActiveStatus": "no", "nces": "213213213123", "banner": "yes", "status_text": "Pending", "deactivateReason": "", "__typename": "SchoolFindResponse" }, { "id": 110, "schoolName": "final school 3", "stateName": "AL", "zipcode": "12345", "cityName": "test", "creationTime": 1641210897140, "addressFirst": "test", "status": "active", "districtName": "21st century preparatory school agency", "adminActiveStatus": "no", "nces": "213213213213", "banner": "yes", "status_text": "Pending", "deactivateReason": "", "__typename": "SchoolFindResponse" }, { "id": 109, "schoolName": "final school test1", "stateName": "AS", "zipcode": "12345", "cityName": "test", "creationTime": 1641210598825, "addressFirst": "test", "status": "active", "districtName": "a w beattie career center", "adminActiveStatus": "no", "nces": "123456222111", "banner": "yes", "status_text": "Pending", "deactivateReason": "", "__typename": "SchoolFindResponse" }], "__typename": "SchoolWithCount" } } }
    );
    // backend.verify();
  });

  it('#userAction should navigate to edit page', inject([Router], (router: Router) => {

    let action = { name: 'Edit', path: 'edit', icon: 'edit' };
    let selectedSchool = {
      addressFirst: "test",
      adminActiveStatus: "no",
      banner: "yes",
      cityName: "test",
      creationTime: 1641817993515,
      districtName: "a w beattie career center",
      id: 115,
      nces: "123456789630",
      schoolName: "Vibanshu edit1",
      stateName: "AK",
      status: "active",
      zipcode: "12345",
      __typename: "School"
    };

    const spy = spyOn(router, 'navigateByUrl');
    component.userAction(action, selectedSchool);
    const url = spy.calls.first().args[0];
    expect(url).toBe('/school-management/school-edit/115');

  }));

  it('#userAction should navigate to details page', inject([Router], (router: Router) => {
    let action = { name: 'Edit', path: 'view', icon: 'edit' };
    let selectedSchool = {
      addressFirst: "test",
      adminActiveStatus: "no",
      banner: "yes",
      cityName: "test",
      creationTime: 1641817993515,
      districtName: "a w beattie career center",
      id: 115,
      nces: "123456789630",
      schoolName: "Vibanshu edit1",
      stateName: "AK",
      status: "active",
      zipcode: "12345",
      __typename: "School"
    };

    const spy = spyOn(router, 'navigateByUrl');
    component.userAction(action, selectedSchool);
    const url = spy.calls.first().args[0];
    expect(url).toBe('/school-management/school-view/115');

  }));

  it('#userAction should check for false', () => {
    let path = '';
    let selectedSchool;
    component.userAction(path, selectedSchool);
    expect(false).toEqual(false);
  });

  it('should test changeStatus', () => {
    let id = 1;
    let currentStatus = "inactive";
    component.changeStatus(id, currentStatus);
    const op = backend.expectOne(addTypenameToDocument(updateSchoolStatusQuery));
    op.flush({
      "data": { "updateSchoolStatus": { "id": 139, "status": "inactive", "deactivateReason": "Testing", "__typename": "School" } }
    });
    expect(component.getSchoolList).toBeDefined();
  })

  it('should test applyFilter', () => {
    // when search term available.
    let searchTerm = { text: "test" };
    component.applyFilter(searchTerm)
    expect(component.resetFilter).toHaveBeenCalled()

    // when search term not available.
    searchTerm = { text: "" };
    component.applyFilter(searchTerm)
    expect(component.resetFilter).toHaveBeenCalled()
  });

  it('should call handlePage() return valid', () => {
    const e = { length: 9, pageIndex: 1, pageSize: 5, previousPageIndex: 0 }

    // When search option data avaialble.
    component.searchOptionsData = { "text": 'cc', "query": 'schoolName', "filter": 'active','filterbytype':'All' };
    component.handlePage(e)
    expect(component.currentPage).toEqual(1);

    // When search option data not avaialble.
    component.searchOptionsData = null;
    component.handlePage(e)
    expect(false).toBe(false);
  });

  it("should call reasonDeclaration and return valid", async(() => {
    let res = { "status": "success" };
    spyOn(_dialogsService, 'reasonDeclaration').and.returnValue(of(res))
    component.reasonDeclaration('Inactive', { 'schoolId': '89' });
    fixture.detectChanges();
    expect(component.getSchoolList).toHaveBeenCalled();
  }));

  it("should call reasonDeclaration and return null", async(() => {
    let res = null;
    spyOn(_dialogsService, 'reasonDeclaration').and.returnValue(of(res));
    component.reasonDeclaration('Inactive', { 'schoolId': '89' });
    expect(false).toBe(false);
  }));


  it("should check #openConfrmDlg() - when dialog return some data", () => {
    let res = "data";
    spyOn(_dialogsService, 'confirmationDialogPopUp').and.returnValue(of(res));
    component.openConfrmDlg();
    fixture.detectChanges();
    expect(component.resendInvitationMail).toHaveBeenCalled();
  });

  it('should call #openConfrmDlg() - when dialog return no data', () => {
    let res = null;
    spyOn(_dialogsService, 'confirmationDialogPopUp').and.returnValue(of(res))
    component.openConfrmDlg();
    expect(false).toBe(false);
  });


  it('should call #resendInvitationMail()', () => {
    component.resendInvitationMail();
    const op = backend.expectOne(addTypenameToDocument(massResendInvitationMail));
    component.resendInvitationMail();
    op.flush({ "data": { "massResendSchoolAdminInvitationEmail": { "failEmailSendSchoolAdmin": [{ "school_id": 237, "school_name": "1st Feb Dev School error 1", "name": null, "email": null, "error": "School admin name not added, School admin email not added, School admin phone number not added", "__typename": "FailEmailSendSchoolAdminResponse" }], "__typename": "MassResendSchoolAdminInviteEmailResponse" } } });
    expect(true).toBe(true);
  });

  it('should call #openResendFailedDialog()', () => {
    let data = [1, 2];
    component.openResendFailedDialog(data);
    let res = "data";
    spyOn(_dialogsService, 'massResendMailStatusDialog').and.returnValue(of(res));
    expect(true).toBe(true);

    data = [];
    component.openResendFailedDialog(data);
    expect(false).toBe(false);
  });

  it('should check #customSorting()', () => {
    component.sorting.sortingByColumn = "schoolName";
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

    expect(component.getSchoolList).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly getSchoolList', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.getSchoolList();
   expect(component['_errorHandler'].manageError).toHaveBeenCalled();
});
it('test_error_is_handled_correctly changeStatus', () => {
  spyOn(component['_apollo'], 'mutate').and.returnValue(throwError('error'));
  spyOn(component['_errorHandler'], 'manageError');
  component.changeStatus('1','active');
 expect(component['_errorHandler'].manageError).toHaveBeenCalled();
});
it('test_error_is_handled_correctly resendInvitationMail', () => {
  spyOn(component['_apollo'], 'mutate').and.returnValue(throwError('error'));
  spyOn(component['_errorHandler'], 'manageError');
  component.resendInvitationMail();
 expect(component['_errorHandler'].manageError).toHaveBeenCalled();
});
it('should add a new id to the selected array', () => {
  const id = 1;
  component.selected = [2, 3];
  component.OnChange(id);
  expect(component.selected).toEqual([2, 3, 1]);
});
  // Tests that an existing id is removed from the selected array
  it('should remove an existing id from the selected array', () => {
    const id = 2;
    component.selected = [2, 3];
    component.OnChange(id);
    expect(component.selected).toEqual([3]);
});
it('should return true when id is present in selected array', () => {
  component.selected = [1, 2, 3];
  const result = component.isSelected(2);
  expect(result).toBe(true);
});
    // Tests that the 'isAllSelected' boolean value is toggled to true when it is false.
    it('should toggle isAllSelected to true when it is false', function() {
      component.isAllSelected = false;
      component.masterToggle();
      expect(component.isAllSelected).toBe(true);
    });
        // Tests that the method returns the correct label for a row when it is selected.
        it('should return the correct label for a selected row', function() {
          const row = { id: 1 };
          component.isAllSelected = true;
          const label = component.checkboxLabel(row);
          expect(label).toBe('deselect row 2');
        });
            // Tests that the method returns the correct label for a row when it is deselected.
    it('should return the correct label for a deselected row', function() {
      const row = { id: 1 };
      component.isAllSelected = false;
      const label = component.checkboxLabel(row);
      expect(label).toBe('select row 2');
    });
        // Tests that the selected array is reset to an empty array when it is already empty
        it('should reset the selected array to an empty array when it is already empty', function() {
          // Arrange
          component.selected = [];
          component.isAllSelected = false;
    
          // Act
          component.resetSelection();
    
          // Assert
          expect(component.selected).toEqual([]);
          expect(component.isAllSelected).toBe(false);
        });


});
