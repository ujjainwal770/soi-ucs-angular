import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { archiveMessageQuery, getBroadcastMessageDetailQuery } from 'src/app/core/query/broadcast-message';
import { CustomErrorHandlerService } from 'src/app/core/services/custom-error-handler.service';
import { DialogsService } from 'src/app/core/services/dialog-service';

@Component({
  selector: 'app-view-broadcast-message',
  templateUrl: './view-broadcast-message.component.html',
  styleUrls: ['./view-broadcast-message.component.scss']
})
export class ViewBroadcastMessageComponent implements OnInit {
  messageId = 0;
  messageDetails: any = {};
  isEditable :boolean;
  constructor(
    private readonly _activateRouter: ActivatedRoute,
    private readonly _spinner: NgxSpinnerService,
    private readonly _apollo: Apollo,
    private readonly _router: Router,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _dialogsService: DialogsService,
    private readonly toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this._activateRouter.params.subscribe(params => {
      this.messageId = params.id ? parseFloat(params.id) : 0;
      this.getMessageDetails();
    });
  }
  getMessageDetails() {
    this._spinner.show();
    this._apollo
      .query({
        query: getBroadcastMessageDetailQuery,
        variables: {
          id: this.messageId
        },
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        console.log(data);
        
        this._spinner.hide();
        this.messageDetails = data['getBroadcastMessageDetail'];
        this.isEditable = (this.messageDetails?.status === 'Active');
      }, error => {
        this.isEditable = false;
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  gotoMessageEdit() {
    this._router.navigateByUrl(`/manage-broadcast-message/edit-broadcast-message/${this.messageId}`);
  }
  archieveMessage(){
    const pgtitle = 'Confirm';
    const message = 'Are you sure you want to Archive this message?';
    this._dialogsService
      .confirmationDialogPopUp(pgtitle, message)
      .subscribe(res => {
        if (res) {
          this._spinner.show();
          this._apollo.mutate({
            mutation: archiveMessageQuery,
            variables: {
                     id: this.messageId
                   },
            fetchPolicy: 'no-cache'       

          }).subscribe(() => {
            this._spinner.hide();
            this.toastr.success('Message archieved successfully');
            this.getMessageDetails();
          }, error => {
            this._spinner.hide();
            this._errorHandler.manageError(error, true);
          });
        }
      });
  }

}
