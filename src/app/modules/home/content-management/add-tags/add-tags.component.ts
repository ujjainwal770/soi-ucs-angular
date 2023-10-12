import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CustomErrorHandlerService } from '../../../../core/services/custom-error-handler.service';
import { removeSpaces } from '../../../../validators/custom.validator';

const categoryQuery = gql`
{
  tagcategory{
    id,
    tagcount,
    categoryname
  }
}`;

const addtagQuery = gql`
mutation addTag($input:AddTagsInput!){
  addTag(addTagInput:$input){
    id,
    tagname
  }
}`;
@Component({
  selector: 'app-add-tags',
  templateUrl: './add-tags.component.html',
  styleUrls: ['./add-tags.component.scss']
})
export class AddTagsComponent implements OnInit {

  addtagForm: FormGroup;
  filterOptions: any;
  constructor(
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _apollo: Apollo,
    private readonly _router: Router,
    private readonly toastr: ToastrService) { }

  ngOnInit(): void {
    this.addtagForm = new FormGroup({
      'tagname': new FormControl(null, [Validators.required, removeSpaces]),
      'categoryid': new FormControl('', [Validators.required]),
    });
    this.getFilterStatus();
  }
  getFieldRef(field: string) {
    return this.addtagForm.get(field);
  }
  getFilterStatus() {
    this._apollo
      .query({
        query: categoryQuery,
        variables: {},
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this.filterOptions = data['tagcategory'];
      }, error => {
        this._errorHandler.manageError(error, true);
      });
  }

  submit() {
    const tagArr = this.addtagForm.get('tagname').value.split(',');
    if (tagArr.length) {
      const tagerror = tagArr.filter(element => !(/^[a-zA-Z-]{1,20}$/).test(element));
      if (tagerror.length) {
        this.addtagForm.controls['tagname'].setErrors({
          'incorrect': true
        });
      }
    }
    if (this.addtagForm.valid) {
      this._spinner.show();
      const body = {
        input: {
          'tagname': tagArr,
          'categoryid': Number(this.addtagForm.get('categoryid').value)
        }
      };

      this._apollo.mutate({
        mutation: addtagQuery,
        variables: body
      }).subscribe(({ data }) => {
        this._spinner.hide();
        this.toastr.success('Tag Data Saved successfully');
        this._router.navigate(['/content-management/manage-tags']);
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
    }
  }


}
