import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { editBroadcastMessageQuery, getBroadcastMessageDetailQuery } from '../../../../core/query/broadcast-message';
import { CustomErrorHandlerService } from '../../../../core/services/custom-error-handler.service';

@Component({
  selector: 'app-edit-broadcast-message',
  templateUrl: './edit-broadcast-message.component.html',
  styleUrls: ['./edit-broadcast-message.component.scss']
})
export class EditBroadcastMessageComponent implements OnInit {
  editBroadcastMessageForm: FormGroup;
  selectedBroadcastMessageId: string;
  BroadcastMessage: any;
  minDate: Date = new Date();
  constructor(private readonly _activateRouter: ActivatedRoute,
    private readonly _spinner: NgxSpinnerService,
    private readonly _apollo: Apollo,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _toastr: ToastrService,
    private readonly _router: Router,) { 
      this.minDate.setDate(this.minDate.getDate()+1);
    }

  ngOnInit(): void {
    this.initForm();
    this._activateRouter.params.subscribe(params => {
      this.selectedBroadcastMessageId = params.id;
      this.getBroadcastMessageById();
    });
  }
  initForm(){
    this.editBroadcastMessageForm = new FormGroup({
      'message': new FormControl('', [Validators.required]),
      'expiration_date': new FormControl('', [Validators.required]),
    });
  }
  getBroadcastMessageById(){
    const inputVariables = {
      id: parseFloat(this.selectedBroadcastMessageId)
    };
    this._spinner.show();
    this._apollo
      .watchQuery({
        query: getBroadcastMessageDetailQuery,
        variables: inputVariables,
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true
      }).valueChanges.subscribe(({ data }) => {
        this._spinner.hide();
        this.BroadcastMessage = data['getBroadcastMessageDetail'];
        this.getFieldR('message').setValue(this.BroadcastMessage?.message);
        this.getFieldR('expiration_date').setValue(new Date(this.BroadcastMessage.expiration_date));
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }
  getFieldR(name: string) {
    return this.editBroadcastMessageForm.get(name);
  }
  getTimestamp(date) {
    return new Date(date).getTime();
  }
  goBack() {
    this.initForm();
    this._router.navigateByUrl('/manage-broadcast-message');
  }
  updateBroadcastMessageDetails() {
    if (this.editBroadcastMessageForm.valid) {
      const inputVariables = {
        id: parseFloat(this.selectedBroadcastMessageId),
        message: this.editBroadcastMessageForm.value.message,
        expiration_date: this.getTimestamp(this.editBroadcastMessageForm.value.expiration_date),
      };
      this._spinner.show();
      this._apollo.mutate({
        mutation: editBroadcastMessageQuery,
        variables: inputVariables
      }).subscribe(() => {
        this._toastr.success('Broadcast message has been updated successfully');
        this.goBack();
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
    } else {
      this.editBroadcastMessageForm.markAllAsTouched();
    }
  }

}
