import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { getCannedMessageColorQuery, publishCannedMessageQuery } from '../../../../../core/query/canned-message';
import { CustomErrorHandlerService } from '../../../../../core/services/custom-error-handler.service';
import { PopoverConfig } from 'ngx-bootstrap/popover';

@Component({
  selector: 'app-add-canned-messages',
  templateUrl: './add-canned-messages.component.html',
  styleUrls: ['./add-canned-messages.component.scss']
})
export class AddCannedMessagesComponent implements OnInit {

  addCannedMessageForm: FormGroup;
  availableColors: any;
  selectedColor: any = {
    hashColor: '',
    colorId: 0
  };

  seletedColor: string;
  @ViewChild('popTemplate') colorPickerPopover: PopoverConfig;
  constructor(
    public _router: Router,
    private readonly _apollo: Apollo,
    private readonly _spinner: NgxSpinnerService,
    private readonly _toastr: ToastrService,
    private readonly _errorHandler: CustomErrorHandlerService
  ) { }

  ngOnInit(): void {
    this.addCannedMessageForm = new FormGroup({
      'messageText': new FormControl('', [Validators.required])
    });
    this.fetchApplicableColors();
  }

  /**
   * @param name of the reactive form control
   * @returns detail of reactive form control
   */
  getFieldR(name: string) {
    return this.addCannedMessageForm.get(name);
  }

  publish() {
    if (this.addCannedMessageForm.valid) {
      this._spinner.show();
      this._apollo.mutate({
        mutation: publishCannedMessageQuery,
        variables: {
          message: this.addCannedMessageForm.value.messageText,
          colorId: this.selectedColor.colorId,
          publish: 1
        }
      }).subscribe(() => {
        this._spinner.hide();
        this._toastr.success('User detail has been updated successfully');
        this.gotoCannedMessageList();
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
    } else {
      this.addCannedMessageForm.markAllAsTouched();
    }
  }

  gotoCannedMessageList() {
    this._router.navigateByUrl('/content-management/canned-messages');
  }

  fetchApplicableColors() {
    this._spinner.show();
    this._apollo
      .query({
        query: getCannedMessageColorQuery,
        variables: {},
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this._spinner.hide();
        this.availableColors = data['fetchCannedMessageColor'];
        const defaultColor = this.availableColors[0];
        this.setSelectedColor(defaultColor);
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  setSelectedColor(colorObj) {
    this.selectedColor.hashColor = colorObj.hasColor;
    this.selectedColor.colorId = colorObj.id;
  }
}
