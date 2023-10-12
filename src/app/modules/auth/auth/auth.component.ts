import { Component, OnInit } from '@angular/core';
import { OktaAuth } from '@okta/okta-auth-js';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogsService } from 'src/app/core/services/dialog-service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  oktaAuth: any;
  constructor(
    private spinner: NgxSpinnerService,
    private _authSerivce: AuthService,
    private readonly _dialogsService: DialogsService
  ) {
    this.oktaAuth = new OktaAuth(environment.OKTA_CONFIGURATION);
  }

  ngOnInit(): void {
    this._dialogsService.closeAllMatDialog();
    this._authSerivce.autoLoginIn();
  }

  async login() {
    this.spinner.show();
    await this.oktaAuth.signInWithRedirect({
      originalUri: '/dashboard',
    });
  }
}
