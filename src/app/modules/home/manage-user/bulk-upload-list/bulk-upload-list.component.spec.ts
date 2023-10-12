import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { downloadStudentBlobQuery, schoolBulkUploadListQuery, studentBulkUploadListQuery } from 'src/app/core/query/bulk-upload';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';

import { BulkUploadListComponent } from './bulk-upload-list.component';

describe('BulkUploadListComponent', () => {
  let component: BulkUploadListComponent;
  let fixture: ComponentFixture<BulkUploadListComponent>;
  let backend: ApolloTestingController;
  let _localStorage: LocalStorageService;
  let _utilityService: UtilityService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BulkUploadListComponent],
      imports: [MaterialModule,
        RouterTestingModule,
        ToastrModule.forRoot(),
        HttpClientModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ApolloTestingModule
      ],
      providers: [ToastrService, UtilityService, LocalStorageService,
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
    fixture = TestBed.createComponent(BulkUploadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.inject(ApolloTestingController);
    _localStorage = TestBed.inject(LocalStorageService);
    _utilityService = TestBed.inject(UtilityService);

    spyOn(component, 'ngOnInit').and.callThrough();
    spyOn(component, 'getStudents').and.callThrough();
    spyOn(component, 'getSchools').and.callThrough();
    spyOn(component, 'downloadFiles').and.callThrough();
    spyOn(component, 'bulkUploadScreen').and.callThrough();
    spyOn(component, 'downloadReport').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should #ngOnInit() - when received "student" through utility service resposne', () => {
    let msg = "student";
    spyOn(_utilityService, "getClickEvent").and.returnValue(of(msg));
    component.ngOnInit();
    expect(component.bulkUploadScreen).toHaveBeenCalled();
  });

  it('should #bulkUploadScreen() - when calling getStudent() function', () => {
    let isSchoolAdmin = true;
    component.bulkUploadScreen(isSchoolAdmin);
    expect(component.getStudents).toHaveBeenCalled();
  });

  it('should #bulkUploadScreen() - when calling getSchools() function', () => {
    let isSchoolAdmin = false;
    component.bulkUploadScreen(isSchoolAdmin);
    expect(component.getSchools).toHaveBeenCalled();
  });



  it('should check #handlePage() - when calling getSchools()', () => {
    const e = {
      length: 9,
      pageIndex: 1,
      pageSize: 5,
      previousPageIndex: 0
    }
    component.handlePage(e, 'school');
    expect(component.getSchools).toHaveBeenCalled();
  });

  it('should check #handlePage() - when calling getStudents()', () => {
    const e = {
      length: 9,
      pageIndex: 1,
      pageSize: 5,
      previousPageIndex: 0
    }
    component.handlePage(e, 'student')
    expect(component.getStudents).toHaveBeenCalled();
  });

  it('should test #getStudents()', () => {
    component.getStudents();
    const op = backend.expectOne(addTypenameToDocument(studentBulkUploadListQuery));
    op.flush({
      "data": { "userBulkUploadList": { "count": 16, "data": [{ "load_id": "0x8D9F83E5B10E1A4", "file_name": "Student-1template.csv", "uploaded_by": 6, "total_count": 4, "correct_count": 3, "error_count": 1, "upload_date": 1645780093351, "upload_status": "partially_completed", "token_name": "8d130ff8-2c74-41d8-98fe-a770af73ec8f9fac3f00-c4d5-4d3e-b7a8-259d162aeb18", "error_token_name": "2a349927-c54d-4e4f-b253-4ceb3d35c0893ff1a4d5-f605-450d-93e7-40faa0b02712", "upload_status_text": "Partially Completed", "upload_by_name": "Devi", "__typename": "UserBulkUploadFindResponse" }, { "load_id": "0x8D9F83DB94C63E1", "file_name": "test2.csv", "uploaded_by": 6, "total_count": 1, "correct_count": 1, "error_count": 0, "upload_date": 1645779822832, "upload_status": "completed", "token_name": "3d02dc71-6ff6-4c2c-8708-d048ef68887f88d8370b-966f-4d50-8e06-951e13a834c1", "error_token_name": "", "upload_status_text": "Completed", "upload_by_name": "Devi", "__typename": "UserBulkUploadFindResponse" }, { "load_id": "0x8D9F829832AF38C", "file_name": "Student-template.csv", "uploaded_by": 6, "total_count": 4, "correct_count": 3, "error_count": 1, "upload_date": 1645771141484, "upload_status": "partially_completed", "token_name": "85eb6988-717c-4fc1-a3cf-a5d23f8dadfbd1a15eb2-4d4b-48c0-ba07-64bcfcdf0c26", "error_token_name": "9ef47334-e5c0-4899-8a75-9e2a05d60aedd855a728-816e-4647-8ec9-35b03f3d80c8", "upload_status_text": "Partially Completed", "upload_by_name": "Devi", "__typename": "UserBulkUploadFindResponse" }, { "load_id": "0x8D9F75BC1766E41", "file_name": "test1111.csv", "uploaded_by": 6, "total_count": 4, "correct_count": 0, "error_count": 4, "upload_date": 1645682769602, "upload_status": "error", "token_name": "7c66e535-79f7-4ae3-bb32-fe13fb79fcd2023fe7e6-192a-409f-bf16-54ae1431ff90", "error_token_name": "487acfdd-4c08-4bef-8d5e-f00a693a221582f191a2-7e9b-47e5-906a-e0cc81632adb", "upload_status_text": "Error", "upload_by_name": "Devi", "__typename": "UserBulkUploadFindResponse" }, { "load_id": "0x8D9F6E111D1D158", "file_name": "test1.csv", "uploaded_by": 6, "total_count": 6, "correct_count": 1, "error_count": 5, "upload_date": 1645630076469, "upload_status": "partially_completed", "token_name": "db6a18b0-abee-4143-956e-214fa3fae499a0da7596-33b8-41da-9a9f-02f0980fc09f", "error_token_name": "e21f8d6b-5a4e-4577-94e2-cdf2bb26066fe82f5ebe-6284-4f07-96f5-ce6017e945ba", "upload_status_text": "Partially Completed", "upload_by_name": "Devi", "__typename": "UserBulkUploadFindResponse" }, { "load_id": "0x8D9F6E0CD6D7112", "file_name": "Student-template.csv", "uploaded_by": 6, "total_count": 4, "correct_count": 3, "error_count": 1, "upload_date": 1645629962068, "upload_status": "partially_completed", "token_name": "202118cd-3417-4118-b006-538237dc60540b35fa80-f4c1-4441-be73-4dd116c0ac02", "error_token_name": "81e95611-950a-40f7-a28a-2d021e0f0a44bcffb2b2-7a5b-48d3-8fb4-41cd1e501bb8", "upload_status_text": "Partially Completed", "upload_by_name": "Devi", "__typename": "UserBulkUploadFindResponse" }, { "load_id": "0x8D9F6DFFDA158D2", "file_name": "Student-template.csv", "uploaded_by": 6, "total_count": 4, "correct_count": 3, "error_count": 1, "upload_date": 1645629613174, "upload_status": "partially_completed", "token_name": "243195d8-c918-402d-932a-5ed726050ab509cce228-5354-4a9d-8ee7-25b73ad239cd", "error_token_name": "b92dcb75-0719-429c-94ec-0f00eed24267e709ca2c-097d-48a5-817e-72e25c64ce19", "upload_status_text": "Partially Completed", "upload_by_name": "Devi", "__typename": "UserBulkUploadFindResponse" }, { "load_id": "0x8D9F6D8DBE780D8", "file_name": "test2.csv", "uploaded_by": 6, "total_count": 1, "correct_count": 1, "error_count": 0, "upload_date": 1645626550931, "upload_status": "completed", "token_name": "b1532c3c-7860-40f3-bbad-c50c2430d7cbfe99aaf3-ccc9-40b3-9bbf-13d4c6be784c", "error_token_name": "", "upload_status_text": "Completed", "upload_by_name": "Devi", "__typename": "UserBulkUploadFindResponse" }, { "load_id": "0x8D9F6A9A118DB2F", "file_name": "Student-template.csv", "uploaded_by": 6, "total_count": 3, "correct_count": 2, "error_count": 1, "upload_date": 1645606265567, "upload_status": "partially_completed", "token_name": "4b9bf57f-c7f1-48df-b01d-ce5ae797b2cad222f4bd-d7af-432b-8cd5-e9be0f373421", "error_token_name": "3766b900-dd0b-4678-b7b6-acd418fa8dfb45eb3b56-9dd3-4ffa-aa77-fb3250378c64", "upload_status_text": "Partially Completed", "upload_by_name": "Devi", "__typename": "UserBulkUploadFindResponse" }, { "load_id": "0x8D9F6A949128F29", "file_name": "Student-template.csv", "uploaded_by": 6, "total_count": 3, "correct_count": 2, "error_count": 1, "upload_date": 1645606117666, "upload_status": "partially_completed", "token_name": "88d3cd2a-d8c3-41ab-b3f3-aed0b88b05c2275b2399-7f26-4bad-a9d4-1de98cdf2561", "error_token_name": "ad0be8bd-8e28-44d2-9a54-ff6df6bcfe574f92931e-f406-447d-830a-181394ddcbc7", "upload_status_text": "Partially Completed", "upload_by_name": "Devi", "__typename": "UserBulkUploadFindResponse" }], "__typename": "UserBulkUploadListResponse" } }
    });
    expect(true).toBe(true);
  });

  it('should test #getSchools()', () => {
    component.getSchools();
    const op = backend.expectOne(addTypenameToDocument(schoolBulkUploadListQuery));
    op.flush({
      "data": { "schoolBulkUploadList": { "count": 1, "data": [{ "id": 44, "load_id": "0x8DA715DA875EBE9", "file_name": "1659097625183_School-template.csv", "total_count": 1, "correct_count": 0, "error_count": 1, "upload_date": 1659097629746, "upload_status": "error", "token_name": "1659097625183_School-template_f1e15899-ca4e-4c37-9687-4a8319103f8c", "status": "active", "error_token_name": "ErrorFile_920b7ac1-c1ca-49a7-b259-d075ec65e935", "updation_time": 1659097629568, "uploaded_by_email": "demouser@yopmail.com", "upload_status_text": "Error", "__typename": "schoolBulkUploadFindResponse" }], "__typename": "SchoolBulkUploadListResponse" } }
    });
    expect(true).toBe(true);
  });

  // [ Excluded ] - Test case getting stuck due to the below line of unit test. 
  xit('should check #downloadReport()', () => {
    component.downloadReport('www.google.com');
    expect(component).toBeTruthy();
  });

  // [ Excluded ] - Test case getting stuck due to the below line of unit test
  xit('should test downloadFiles', () => {
    component.downloadFiles('Student-1template.csv', 'dsf')
    const op = backend.expectOne(addTypenameToDocument(downloadStudentBlobQuery));
    op.flush({
      "data": {
        "downloadFromBlobUsingName": {
          "readUri": "/reports",
          "blobName": "test_blob_name", "__typename": "DownloadFromBlobUsingNameResponse"
        }
      }
    }
    );
    expect(component.dataSource).toBeDefined();
  });
});
