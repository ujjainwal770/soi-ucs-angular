import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { getAdminRolesQuery, removeAdminRoleQuery } from 'src/app/core/query/admin-role';
import { DialogsService } from 'src/app/core/services/dialog-service';
import { HttpService } from 'src/app/core/services/http.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { AdminRolesComponent } from './admin-roles.component';

describe('AdminRolesComponent', () => {
  let component: AdminRolesComponent;
  let fixture: ComponentFixture<AdminRolesComponent>;
  let _dialogsService;
  let backend: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminRolesComponent],
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
      providers: [HttpService, ToastrService, NgxSpinnerService, UtilityService, DialogsService,
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
    fixture = TestBed.createComponent(AdminRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    _dialogsService = TestBed.inject(DialogsService);
    backend = TestBed.inject(ApolloTestingController);
    spyOn(component, "handlePage").and.callThrough();
    spyOn(component, "getAdminRoles").and.callThrough();
    spyOn(component, "removeAdminRole").and.callThrough();
    spyOn(component, "onRemoveActionClicked").and.callThrough();
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

  it("should call getAdminRoles()", () => {
    component.getAdminRoles();
    const op = backend.expectOne(addTypenameToDocument(getAdminRolesQuery));
    op.flush({
      "data": {
        "getAdminRoleList": {
          "count": 2,
          "data": [
            {
              "roleName": "Super Admin",
              "count": 17,
              "description": "Permissions for Managing all features",
              "status": "active"
            },
            {
              "roleName": "Content Manager",
              "count": 13,
              "description": "Responsible for managing tags and challenge abuse section",
              "status": "active"
            }
          ]
        }
      }
    }
    );
    expect(component.dataSource).toBeDefined();
  });

  it('should call onRemoveActionClicked() - check when dialog response available', () => {
    let roleName = "School Manager";
    let res = { "data": "data" };

    spyOn(_dialogsService, 'confirmationDialogPopUp').and.returnValue(of(res));
    component.onRemoveActionClicked(roleName);
    fixture.detectChanges();
    expect(component.removeAdminRole).toHaveBeenCalled();
  });

  it('should call onRemoveActionClicked() - check when dialog response not available', () => {
    let roleName = "School Manager";
    let res = null;
    spyOn(_dialogsService, 'confirmationDialogPopUp').and.returnValue(of(res))
    component.onRemoveActionClicked(roleName);
  });

  it('should call removeAdminRole()', () => {
    let roleName = "School Manager";
    component.removeAdminRole(roleName);
    const op = backend.expectOne(addTypenameToDocument(removeAdminRoleQuery));
    op.flush({ "data": { "removeRole": { "roleName": "Manager 4", "__typename": "Role" } } });
    expect(component.dataSource).toBeDefined();
  });

  it('should check #customSorting()', () => {
    component.sorting.sortingByColumn = "roleName";
    let sortingByColumn = "roleName";

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
    component.sorting.sortingByColumn = "roleName";
    component.sorting.sortingClickCounter = 3;
    component.customSorting(sortingByColumn);

    expect(component.getAdminRoles).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly getAdminRoles', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.getAdminRoles();
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
});
it('test_error_is_handled_correctly removeAdminRole', () => {
  spyOn(component['_apollo'], 'mutate').and.returnValue(throwError('error'));
  spyOn(component['_errorHandler'], 'manageError');
  component.removeAdminRole('role');
  expect(component['_errorHandler'].manageError).toHaveBeenCalled();
});
it('should reset sorting click counter and set sorting order to ascending when sorting by a different column', () => {
  const sortingByColumn1 = 'first_name';
  const sortingByColumn2 = 'email';
  component.customSorting(sortingByColumn1);
  component.customSorting(sortingByColumn2);
  expect(component.sorting.sortingByColumn).toEqual(sortingByColumn2);
  expect(component.sorting.currentOrder).toEqual(1);
});
});
