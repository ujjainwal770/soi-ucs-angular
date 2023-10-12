import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities/graphql/transform';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { studentBulkUploadQuery } from 'src/app/core/query/bulk-upload';
import { DialogsService } from 'src/app/core/services/dialog-service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';

import { StudentBulkUploadComponent } from './student-bulk-upload.component';
import { of, throwError } from 'rxjs';

describe('StudentBulkUploadComponent', () => {
  let component: StudentBulkUploadComponent;
  let fixture: ComponentFixture<StudentBulkUploadComponent>;
  let httpTestingController: HttpTestingController;
  let backend: ApolloTestingController;
  let _dialogsService: DialogsService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentBulkUploadComponent ],
      imports:[MaterialModule,
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
        HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule,
        ApolloTestingModule
      ],
      providers:[ToastrService,DialogsService,
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
    fixture = TestBed.createComponent(StudentBulkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpTestingController = TestBed.get(HttpTestingController)
    backend = TestBed.inject(ApolloTestingController);
    //_dialogsService = TestBed.inject(DialogsService);
    spyOn(component, 'getBulkUploadValidations').and.callThrough();
    jasmine.createSpy('bulkUploadValidations').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handleClick', () => {
    const e = {
      target: {
        result: '',
        files: [{
          name: 'Sneha.csv',
          type: "text/csv",
          size: 180710
        }]
      }
    }
    component.handleClick(e)
    expect(component).toBeTruthy();
  });
  it('should onFileSelected', () => {
    const e = {
      target: {
        result: '',
        files: [{
          name: 'Sneha.csv',
          type: "text/csv",
          size: 180710
        }]
      }
    }
    component.onFileSelected(e)
    expect(component).toBeTruthy();
  });
  it('should onFileSelected not csv', () => {
    const e = {
      target: {
        result: '',
        files: [{
          name: 'Sneha.jpg',
          type: "image/jpg",
          size: 180710
        }]
      }
    }
    component.onFileSelected(e)
    expect(component).toBeTruthy();
  });
  it('should cancel', () => {
    component.cancel();
    expect(component).toBeTruthy();
  });
  it('should upload', () => {
    const e = {lastModified: 1601984029839,
      lastModifiedDate: 'Tue Oct 06 2020 13:33:49 GMT+0200 (Central European Summer Time)' ,
      name: "angular-forms-course-small.csv",
      size: 56411,
      type: "text/csv",
      webkitRelativePath: ""
    }
    component.bulkForm.get('bulkfile').setValue(e);
    component.upload()
    let res = {"obj":{"bulkUploadData":null,"csvValidationStatus":"success","fileName":"test1.csv","errorStatus":{"message":"Field 'firstName' doesn't have a default value","code":"ER_NO_DEFAULT_FOR_FIELD","errno":1364,"sqlState":"HY000","sqlMessage":"Field 'firstName' doesn't have a default value","sql":"INSERT INTO `filebulkupload`(`id`, `firstName`, `lastName`, `email`, `dob`, `nces`, `creation_time`, `updation_time`) VALUES (DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT)","name":"QueryFailedError","query":"INSERT INTO `filebulkupload`(`id`, `firstName`, `lastName`, `email`, `dob`, `nces`, `creation_time`, `updation_time`) VALUES (DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT)","parameters":[]}},"file":{"fieldname":"csv","originalname":"test1.csv","encoding":"7bit","mimetype":"text/csv","destination":"/usr/src/app/src/resources/tmp/","filename":"test1.csv","path":"/usr/src/app/src/resources/tmp/test1.csv","size":376}}
    const req = httpTestingController.expectOne(
      component.baseurl + "file-bulk-upload/upload"
    );
    // Assert that the request is a GET.
    expect(req.request.method).toEqual("POST");
    fixture.detectChanges();
    req.flush(res);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('should upload no file', () => {
    const e = {lastModified: 1601984029839,
      lastModifiedDate: 'Tue Oct 06 2020 13:33:49 GMT+0200 (Central European Summer Time)' ,
      name: "angular-forms-course-small.csv",
      size: 56411,
      type: "text/csv",
      webkitRelativePath: ""
    }
    component.bulkForm.get('bulkfile').setValue('');
    component.upload()

    expect(component).toBeTruthy();
  });

  it('should test studentBulkUploadQuery', () => {
    // const op = backend.expectOne(schoolQuery);
    component.fileName = 'Sneha.csv';
    component.getBulkUploadValidations(component.fileName)
    const op = backend.expectOne(addTypenameToDocument(studentBulkUploadQuery));
    op.flush({"data":{"getBulkUpload":{"blobName":"d9e69e9f-d444-41db-b612-bbd1f72e96c59d0fe803-7fab-4643-94db-1f519a2fc754","loadId":"\"0x8D9FACD4AD50B39\"","__typename":"UserBulkUploadResponse"}}});
    expect(component).toBeTruthy();
    backend.verify();
  });
  xit("should call bulkUploadValidations and return valid", () => {
    let res={ data: 'data' }
    // spyOn(_dialogsService, 'bulkUploadValidations').and.returnValue(of(res))
    component.bulkUploadValidations('Validation',{'abc':'2'});
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('test_error_is_handled_correctly getBulkUploadValidations', () => {
    spyOn(component['_apollo'], 'mutate').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.getBulkUploadValidations('filename');
   expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  xit("should check #bulkUploadValidations() ", () => {
    let res = null;
    spyOn(_dialogsService, 'bulkUploadValidations').and.returnValue(of(res));
    component.bulkUploadValidations('title',{});
    expect(true).toBe(true);
  });
  //getBulkUploadValidations
});
