import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Apollo, gql } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { _CONST } from '../../../../core/constants/app.constants';
import { TagData } from '../../../../core/model/tag-model';
import { AppConstantService } from '../../../../core/services/app-constant.service';
import { CustomErrorHandlerService } from '../../../../core/services/custom-error-handler.service';
import { DialogsService } from '../../../../core/services/dialog-service';
import { SharedService } from '../../../../core/services/shared.service';
import { UtilityService } from '../../../../core/services/utility.service';
import { removeSpaces } from '../../../../validators/custom.validator';

export interface TagListData {
  id: number,
  tagname: string,
  categoryid: number,
  categoryname: string,
  status: string,
  creationTime: string,
  updationTime: string,
}

const categoryQuery = gql`
{
  tagcategory{
    id,
    tagcount,
    categoryname
  }
}`;

const searchByQuery = gql`
{
  tagSearchOptionList{
    options{
      text,
      query
    }
  }
}`;

const tagQuery = gql`query findTagsSearchByQuery($input:TagsQuerySearchOptionInput!){
  findTagsSearchByQuery(tagsQuerySearchOptionInput:$input){
    tags{
      id,
      tagname,
      categoryid,
      creationTime,
      status
    },
    count
  }
}`;
const removeQuery = gql`
mutation removeTag($input:RemoveTagsInput!){
  removeTag(removeTagInput:$input){
    id,
    tagname,
    categoryid,
    creationTime,
    status
  }
}`;
@Component({
  selector: 'app-manage-tags',
  templateUrl: './manage-tags.component.html',
  styleUrls: ['./manage-tags.component.scss']
})
export class ManageTagsComponent implements OnInit, AfterViewInit {
  statusAction = 'remove';
  searchbyTxt = 'Name';
  sorting = this._sharedService.getSortingData('manageTagListing');
  displayedColumns: string[] = ['id', 'tagname', 'categoryname', 'creationTime', 'actions'];
  dataSource = new MatTableDataSource<TagData>();
  pageSizes = _CONST['defaultPageSizeArray'];
  pageSizeCount: number;
  dataSour = [];
  tagListDetail: TagData[] = [];
  pageEvent: PageEvent;
  destroyed = new Subject<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selection = new SelectionModel<TagListData>(true, []);
  count: any;
  searchOptions: any = [];
  filterOptions: any = [];
  tagsFormgroup: FormGroup;
  currentPage = 0;
  @ViewChild('searchTxtBox') searchTxtBox: ElementRef;
  searchOptionsData: { query: any; text: string; filter: string };
  bulkArr: number[];
  constructor(
    private readonly _apollo: Apollo,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _utilityService: UtilityService,
    private readonly toastr: ToastrService,
    private readonly _dialogsService: DialogsService,
    private readonly _sharedService: SharedService,
    private readonly _const: AppConstantService,
  ) {
    this.pageSizeCount = this.pageSizes[0];
  }

  ngOnInit(): void {
    this.tagsFormgroup = new FormGroup({
      'filterby': new FormControl('0', [Validators.required]),
      'searchBy': new FormControl('tagname', [Validators.required]),
      'searchText': new FormControl('', [Validators.required, removeSpaces]),
      'page': new FormControl(''),
      'limit': new FormControl(''),
    });
    this.getFilterStatus();
    this.getSearchOptions();
  }
  ngAfterViewInit(): void {
    this.searchUserText();
  }
  searchUserText() {
    const searchTerms = this._utilityService.searchData(this.searchTxtBox.nativeElement);
    searchTerms.subscribe(res => {
      if (res && res.length > 0) {
        this.tagsFormgroup.value.searchText = res;
        this.resetFilter();
      } else {
        this.resetFilter();
      }
    });
  }
  getFieldRef(field: string) {
    return this.tagsFormgroup.get(field);
  }

  getFilterStatus() {
    this._apollo
      .query({
        query: categoryQuery,
        variables: {},
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this.filterOptions = data['tagcategory'];
        this.getTags();
      }, error => {
        this._errorHandler.manageError(error, true);
      });
  }

  getSearchOptions() {
    this._apollo
      .query({
        query: searchByQuery,
        variables: {},
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this.searchOptions = data['tagSearchOptionList']['options'];
      }, error => {
        this._errorHandler.manageError(error, true);
      });
  }
  initSelect = data => {
    return data.map(item => ({
      ...item,
      categoryname: this.getfilteredCategories(item.categoryid)
    }));
  };

  getTags() {
    this._spinner.show();
    this.dataSource = new MatTableDataSource([]);
    this._apollo
      .query({
        query: tagQuery,
        variables: {
          input: {
            keyword: this.tagsFormgroup.value.searchText,
            query: this.tagsFormgroup.value.searchBy,
            filter: Number(this.tagsFormgroup.value.filterby),
            page: this.currentPage,
            limit: this.pageSizeCount,
            orderBy: this.sorting.sortingByColumn,
            order: this.sorting.sortingOrders[this.sorting.currentOrder]
          }
        },
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this._spinner.hide();

        const taglist = this.initSelect(data['findTagsSearchByQuery']['tags']);
        this.dataSource = new MatTableDataSource(taglist);
        this.tagListDetail = taglist;
        this.count = data['findTagsSearchByQuery']['count'];
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  getfilteredCategories(catId) {
    const res = this.filterOptions.find(element => element.id === catId);
    return res?.categoryname;
  }

  getSearch() {
    this.resetFilter();
  }
  getSearchTxt() {
    const searchByValue = this.getFieldRef('searchBy').value;
    if (searchByValue === 'tagname') {
      return 'Tag';
    } else {
      return '';
    }
  }


  handlePage(e) {
    this.currentPage = e.pageIndex;
    this.pageSizeCount = e.pageSize;
    this.getTags();
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;

  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: TagListData): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  changeStatus(id) {
    this.bulkArr = [];
    this.bulkArr.push(id);
    this.updateStatusAction(this.bulkArr);
  }

  updateStatus() {
    this.bulkArr = [];
    this.selection.selected.forEach(element => {
      if (this.bulkArr.indexOf(element['id']) !== 0) {
        this.bulkArr.push(element['id']);
      }
    });

    if (this.bulkArr.length > 0) {
      this.updateStatusAction(this.bulkArr);
    } else {
      this.toastr.error('Please select atleast one tag to remove');
    }
  }

  updateStatusAction(arr: Array<number>) {
    const pgtitle = 'Confirm';
    const message = 'Are you sure want to remove this tags ?';
    this._dialogsService
      .confirmationDialogPopUp(pgtitle, message)
      .subscribe(res => {
        if (res) {
          this._spinner.show();
          const body = {
            input: {
              tagids: arr
            }
          };
          this._apollo.mutate({
            mutation: removeQuery,
            variables: body,
            refetchQueries: [{
              query: tagQuery,
              variables: {
                input: {
                  keyword: this.tagsFormgroup.value.searchText,
                  query: this.tagsFormgroup.value.searchBy,
                  filter: Number(this.tagsFormgroup.value.filterby),
                  page: this.currentPage,
                  limit: this.pageSizeCount
                }
              },
            }]

          }).subscribe(data => {
            this._spinner.hide();
            this.toastr.success('Tag removed successfully');
            this.selection.clear();
            this.getFilterStatus();
          }, error => {
            this._spinner.hide();
            this._errorHandler.manageError(error, true);
          });
        }
      });
  }

  resetFilter() {
    this.paginator.pageIndex = 0;
    this.currentPage = 0;
    this.getTags();
  }

  // Implementing custom sorting and fetch the sorted data though API.
  customSorting(sortingByColumn) {
    // when different -> existing and new column
    if (this.sorting.sortingByColumn !== sortingByColumn) {
      this.sorting.currentOrder = 1;
      this.sorting.sortingClickCounter = 0;
    }

    this.sorting.sortingClickCounter++;
    this.sorting.sortingByColumn = sortingByColumn;
    switch (this.sorting.sortingClickCounter) {

      //Ascending order
      case _CONST.one:
        this.sorting.currentOrder = 1;
        break;

      // Descending order
      case _CONST.two:
        this.sorting.currentOrder = 0;
        break;

      // Intial order i.e. descending
      case _CONST.three:
        this.sorting = { ...this._const.MANAGE_TAG_LIST_DEFAULT_SORTING };
        break;
      default:
        break;
    }
    this._sharedService.setSortingData('manageTagListing', this.sorting);
    this.getTags();
  }
}
