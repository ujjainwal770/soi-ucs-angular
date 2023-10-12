import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { sendBroadcastMessageQuery } from '../../../../core/query/broadcast-message';
import { CustomErrorHandlerService } from '../../../../core/services/custom-error-handler.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-broadcast-message',
  templateUrl: './add-broadcast-message.component.html',
  styleUrls: ['./add-broadcast-message.component.scss']
})
export class AddBroadcastMessageComponent implements OnInit {
  addBroadcastMessageForm: FormGroup;
  minDate: Date = new Date();

  constructor(private readonly _spinner: NgxSpinnerService,
    private readonly _apollo: Apollo,
    private readonly _toastr: ToastrService,
    private readonly _errorHandler: CustomErrorHandlerService,
    public _router: Router,) { 
      this.minDate.setDate(this.minDate.getDate()+1);
    }

  ngOnInit(): void {
    this.addBroadcastMessageForm = new FormGroup({
      'message': new FormControl('', [Validators.required]),
      'expiration_date': new FormControl('', [Validators.required]),
    });
  }
  getFieldR(name: string) {
    return this.addBroadcastMessageForm.get(name);
  }
  getTimestamp(date) {
    return new Date(date).getTime();
  }

  submit(){
    if (this.addBroadcastMessageForm.valid) {
      this._spinner.show();
      this._apollo.mutate({
        mutation: sendBroadcastMessageQuery,
        variables: {
          message: this.addBroadcastMessageForm.value.message,
          expiration_date: this.getTimestamp(this.addBroadcastMessageForm.value.expiration_date),
        }
      }).subscribe(() => {
        this._spinner.hide();
        this._toastr.success('Broadcast message has been sent successfully');
        this.gotoBroadcastMessageList();
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
    } else {
      this.addBroadcastMessageForm.markAllAsTouched();
    }
  }
  gotoBroadcastMessageList() {
    this._router.navigateByUrl('/manage-broadcast-message');
  }
}
