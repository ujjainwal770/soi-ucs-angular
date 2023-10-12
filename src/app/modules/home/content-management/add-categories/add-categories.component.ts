import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { filter } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CategoryData } from '../../../../core/model/category-model';
import { addCategoryuery, categoryQuery, findTagQuey, removeCategoryQuery, removeTagsQuery } from '../../../../core/query/add-categories';
import { CustomErrorHandlerService } from '../../../../core/services/custom-error-handler.service';
import { DialogsService } from '../../../../core/services/dialog-service';
import { UtilityService } from '../../../../core/services/utility.service';
import { removeSpaces, validateCharHyphenLength } from '../../../../validators/custom.validator';
import { _CONST } from '../../../../core/constants/app.constants';


export interface CategoryListsData {

  id: number,
  categoryname: string,
  tagcount: number,
}


@Component({
  selector: 'app-add-categories',
  templateUrl: './add-categories.component.html',
  styleUrls: ['./add-categories.component.scss']
})
export class AddCategoriesComponent implements OnInit {

  addCategoriesForm: FormGroup;
  filterOptions: any = [];
  dataSource = new MatTableDataSource<CategoryData>();
  displayedColumns: string[] = ['categoryname', 'tagcount', 'action'];
  clickedRows = new Set<CategoryData>();
  selectedIndex: any = 0;
  filteredTag: any = [];
  categorySelected: any;
  removable = true;
  tagInput: any = '';
  @ViewChild('searchTxtBox') searchTxtBox: ElementRef;
  tagLists: any;
  removalTags: any[];
  bulkArr: any[];
  removedSlicedTag: any;
  displayRecord = true;
  toBeSelectedCategory: any;
  constructor(
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    public _apollo: Apollo,
    private readonly _router: Router,
    private readonly _utilityService: UtilityService,
    public matDialog: MatDialog,
    private readonly toastr: ToastrService,
    private readonly _dialogsService: DialogsService) { }

  ngOnInit(): void {
    this.addCategoriesForm = new FormGroup({
      'categoryname': new FormControl('', [removeSpaces, Validators.required, validateCharHyphenLength])
    });

    this.getFilterStatus();

  }

  getFieldRef(field: string) {
    return this.addCategoriesForm.get(field);
  }

  getFilterStatus() {
    this._apollo
      .query({
        query: categoryQuery,
        variables: {},
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this.filterOptions = data['tagcategory'];
        this.dataSource = new MatTableDataSource(data['tagcategory']);
        this.categorySelected = this.filterOptions[0]['id'];
        this.getTags(this.filterOptions[0]['id']);
      }, error => {
        this._errorHandler.manageError(error, true);
      });
  }

  getTags(id) {
    this._spinner.show();
    this._apollo
      .query({
        query: findTagQuey,
        variables: {
          'input': id
        },
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this._spinner.hide();
        this.filteredTag = data['findTagsByCategoryForAdmin'];
        this.tagLists = data['findTagsByCategoryForAdmin'];
        this.displayRecord = true;
        if (this.filteredTag.length === 0) {
          this.displayRecord = false;
        }
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }
  selectedRow(id) {
    this.categorySelected = id;
    this.toBeSelectedCategory = id;
    this.getTags(id);
  }

  remove(tags) {
    const pgtitle = 'Confirm';
    const message = 'Are you sure want to remove this tags ?';
    this._dialogsService
      .confirmationDialogPopUp(pgtitle, message)
      .subscribe(res => {
        if (res) {
          this.bulkArr = [];
          this.bulkArr.push(tags.id);
          const arrayForSort = [...this.filteredTag];
          const index = arrayForSort.indexOf(tags);
          if (index >= 0) {
            arrayForSort.splice(index, 1);
          }
          this.filteredTag = arrayForSort;
          this.removalTags = arrayForSort;
          this.removeTags();
        }
      });
  }

  removeAction() {
    const pgtitle = 'Confirm';
    const message = 'Are you sure want to remove this tags ?';
    this._dialogsService
      .confirmationDialogPopUp(pgtitle, message)
      .subscribe(res => {
        if (res) {
          this.removeTags();
        }
      });
  }

  removeTags() {
    this._spinner.show();
    const body = {
      input: {
        'tagids': this.bulkArr
      }
    };

    this._apollo.mutate({
      mutation: removeTagsQuery,
      variables: body,
      refetchQueries: [{
        query: categoryQuery,
        variables: {},
      },
      {
        query: findTagQuey,
        variables: {
          'input': this.toBeSelectedCategory
        },
      }],
    }).subscribe(({ data }) => {
      this._spinner.hide();
      this.toastr.success('Tags Removed successfully');
    }, error => {
      this._spinner.hide();
      this._errorHandler.manageError(error, true);
    });
  }

  onBulkRemoveTags() {
    this.bulkArr = [];
    this.filteredTag.filter(element => {
      if (this.bulkArr.indexOf(element['id']) !== 0) {
        this.bulkArr.push(element['id']);
      }
    });
    this.removeAction();
  }

  onSearch(searchTxt) {

    const searchTerms = searchTxt.target.value;
    let filtered = [...this.tagLists];
    if (searchTerms.length > _CONST.two) {
      filtered = filter(filtered, function (o) {
        return o.tagname.toLowerCase().indexOf(searchTerms) > -1;
      });
    } else if (searchTerms.length === 0) {
      this.getTags(this.categorySelected);
    } else {
      return;
    }
    this.filteredTag = filtered;
  }

  onRemovSearch() {
    this.searchTxtBox.nativeElement.value = '';
    this.getTags(this.categorySelected);
  }

  addCategory(formDirective: FormGroupDirective) {
    if (this.addCategoriesForm.valid) {
      this._spinner.show();
      const body = {
        input: {
          'categoryname': this.addCategoriesForm.get('categoryname').value
        }
      };
      this._apollo.mutate({
        mutation: addCategoryuery,
        variables: body,
        refetchQueries: [{
          query: categoryQuery,
          variables: {},
        }]
      }).subscribe(({ data }) => {
        this._spinner.hide();
        this.toastr.success('Category Saved successfully');
        this.addCategoriesForm.reset();
        formDirective.resetForm();
        this.getFilterStatus();
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
    }
  }

  openDialog() {
    const pgtitle = 'Confirm';
    const message = 'Are you sure want to remove this category ?';
    this._dialogsService
      .confirmationDialogPopUp(pgtitle, message)
      .subscribe(res => {
        if (res) {
          this.removeCategory();
        }
      });
  }

  removeCategory() {
    this._spinner.show();
    const body = {
      input: Number(this.categorySelected)
    };
    this._apollo.mutate({
      mutation: removeCategoryQuery,
      variables: body,
      refetchQueries: [{
        query: categoryQuery,
        variables: {},
      }]
    }).subscribe(({ data }) => {
      this.selectedIndex = 0;
      this._spinner.hide();
      this.toastr.success('Category Removed successfully');
      this.getFilterStatus();
    }, error => {
      this._spinner.hide();
      this._errorHandler.manageError(error, true);
    });
  }
}
