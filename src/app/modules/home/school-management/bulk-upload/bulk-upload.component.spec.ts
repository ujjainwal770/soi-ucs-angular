import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities/graphql/transform';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { schoolBulkUploadQuery } from 'src/app/core/query/bulk-upload';
import { DialogsService } from 'src/app/core/services/dialog-service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { BulkUploadComponent } from './bulk-upload.component';
import { throwError } from 'rxjs';

describe('BulkUploadComponent', () => {
  let component: BulkUploadComponent;
  let fixture: ComponentFixture<BulkUploadComponent>;
  let httpTestingController: HttpTestingController;
  let backend: ApolloTestingController;
  let _dialogsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkUploadComponent ],
      imports:[MaterialModule,
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
        HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule,
        ApolloTestingModule
      ],
      providers:[ToastrService,DialogsService,DialogsService,
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
    fixture = TestBed.createComponent(BulkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpTestingController = TestBed.get(HttpTestingController)
    backend = TestBed.inject(ApolloTestingController);
    spyOn(component,'onFileSelected').and.callThrough();

  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should onFileSelected', () => {
    const e = {
      target : {
        files :[
          {name:'image.png'}
        ]
      }
    }
    component.onFileSelected(e)
    expect(component).toBeTruthy();
  });
  it('should cancel', () => {
    component.cancel();
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
    const op = backend.expectOne(addTypenameToDocument(schoolBulkUploadQuery));

    op.flush({"data":{"getBulkUploadForSchool":{"blobName":"8b6ab13c-6600-40f2-bf5e-f6eeef48d316c977c54c-cfa5-4ed8-bb40-7cf1c60fe905","loadId":"\"0x8DA0377B61052F5\"","__typename":"UserBulkUploadResponse"}}}
    );
    expect(component).toBeTruthy();
    backend.verify();
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
  it('test_error_is_handled_correctly getBulkUploadValidations', () => {
    spyOn(component['_apollo'], 'mutate').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.getBulkUploadValidations('filename');
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
});
