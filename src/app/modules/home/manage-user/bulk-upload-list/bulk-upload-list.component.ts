import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { _CONST } from 'src/app/core/constants/app.constants';
import { downloadStudentBlobQuery, schoolBulkUploadListQuery, studentBulkUploadListQuery } from 'src/app/core/query/bulk-upload';
import { CustomErrorHandlerService } from 'src/app/core/services/custom-error-handler.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { UtilityService } from 'src/app/core/services/utility.service';


export interface UploadListData {
  load_id: number,
  file_name: string,
  upload_date: any,
  upload_by_name: string,
  upload_status_text: string,
  token_name: string,
  error_token_name: string,
  error_count: number,
  total_count: number,
  correct_count: number,
  uploaded_by_email: string
}
@Component({
  selector: 'app-bulk-upload-list',
  templateUrl: './bulk-upload-list.component.html',
  styleUrls: ['./bulk-upload-list.component.scss']
})
export class BulkUploadListComponent implements OnInit {

  dataSource = new MatTableDataSource<UploadListData>();
  displayedColumns: string[] = ['load_id', 'file_name', 'upload_date', 'upload_by_name', 'upload_status_text', 'actions'];
  pageEvent: PageEvent;
  pageSizes = _CONST['defaultPageSizeArray'];
  pageSizeCount: number;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  count: any;
  currentPage = 0;
  nextPage: number;
  displayedColumnsSchool: string[] = ['load_id', 'file_name', 'upload_date', 'uploaded_by_email', 'upload_status_text', 'actions'];

  constructor(
    private readonly _apollo: Apollo,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly toastr: ToastrService,
    public _localStorage: LocalStorageService,
    private _utilityService: UtilityService
  ) {
    this.pageSizeCount = this.pageSizes[0];
  }

  ngOnInit(): void {
    let isSchoolAdmin = this._localStorage.isSchoolAdmin();
    this.bulkUploadScreen(isSchoolAdmin);
    this._utilityService.getClickEvent().subscribe((msg) => {
      this.bulkUploadScreen(isSchoolAdmin);
    });
  }

  bulkUploadScreen(isSchoolAdmin) {
    if (isSchoolAdmin) {
      this.getStudents();
    } else {
      this.getSchools();
    }
  }

  public handlePage(e: any, type) {
    this.currentPage = e.pageIndex;
    this.pageSizeCount = e.pageSize;
    if (type === 'school') {
      this.getSchools()
    } else {
      this.getStudents()
    }
  }

  getStudents() {
    this._spinner.show();
    this.dataSource = new MatTableDataSource([]);
    this._apollo
      .query({
        query: studentBulkUploadListQuery,
        variables: {
          page: this.currentPage,
          limit: this.pageSizeCount
        },
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this._spinner.hide();
        this.dataSource = new MatTableDataSource(data['userBulkUploadList']['data']);
        this.count = data['userBulkUploadList']['count'];
        // this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  getSchools() {
    this._spinner.show();
    this.dataSource = new MatTableDataSource([]);
    this._apollo
      .query({
        query: schoolBulkUploadListQuery,
        variables: {
          page: this.currentPage,
          limit: this.pageSizeCount
        },
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this._spinner.hide();
        this.dataSource = new MatTableDataSource(data['schoolBulkUploadList']['data']);
        this.count = data['schoolBulkUploadList']['count'];
        // this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  downloadFiles(filename, blobName) {
    this._spinner.show();
    this._apollo
      .mutate({
        mutation: downloadStudentBlobQuery,
        variables: {
          filename: filename,
          blobname: blobName
        },
      }).subscribe(({ data }) => {
        this.downloadReport(data['downloadFromBlobUsingName']['readUri'])
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  downloadReport(downloadLink) {
    let link = document.createElement('a');
    // link.download = this.reportType + '.' + this.downloadReportDialogForm.value.fileType;
    link.href = downloadLink;
    link.click();
    this._spinner.hide();
    this.toastr.success('Your download should automatically begin in a few seconds');
  }

}
