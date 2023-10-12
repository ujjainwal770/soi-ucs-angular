import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InMemoryCache } from '@apollo/client/cache';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/core/services/http.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { ReasonDialogComponent } from './reason-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { gql } from 'graphql-tag';
import { addTypenameToDocument } from '@apollo/client/utilities/graphql/transform';
import { throwError } from 'rxjs';

describe('ReasonDialogComponent', () => {
  let component: ReasonDialogComponent;
  let fixture: ComponentFixture<ReasonDialogComponent>;
  let backend: ApolloTestingController;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReasonDialogComponent ],
      imports:[MaterialModule,
        MatDialogModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        ReactiveFormsModule,
        RouterTestingModule,
        ApolloTestingModule
      ],
      providers: [HttpService, ToastrService, NgxSpinnerService,
        {
          provide: APOLLO_TESTING_CACHE,
          useValue: new InMemoryCache({
            addTypename: true
          }),
        },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: { close: () => {} } }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReasonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.get(ApolloTestingController);
    spyOn(component,'submit').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should close dialog on trigger', () => {
    spyOn(component.dialogRef, 'close');
    component.cancel();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  const updateSchoolStatusQuery = gql`
  mutation updateSchoolStatus(
    $id: Float!,
    $status: String!,
    $deactivateReason:String!
  ) {
    updateSchoolStatus(updateSchoolStatusInput: {
      id: $id,
      status: $status, 
      deactivateReason: $deactivateReason  
    }) {
      id,
      status,
      deactivateReason
    }
  }
`;
it('should call submit', () => {
  component.reasonForm .get('reason').setValue('dsds');
  component.reasonForm .get('status').setValue('inactive')
  component.reviewParm= {schoolId : '61'};
 
  component.submit();
  const op = backend.expectOne(addTypenameToDocument(updateSchoolStatusQuery));
  op.flush(
    {"data":{"updateSchoolStatus":{"id":61,"status":"inactive","deactivateReason":"asddsad","__typename":"School"}}
  })
  
});
it('test_error_is_handled_correctly submit', () => {
  spyOn(component['_apollo'], 'mutate').and.returnValue(throwError('error'));
  spyOn(component['_errorHandler'], 'manageError');
  component.reasonForm .get('reason').setValue('dsds');
  component.reasonForm .get('status').setValue('inactive')
  component.reviewParm= {schoolId : '61'};
  component.submit();
 expect(component['_errorHandler'].manageError).toHaveBeenCalled();
});

});
