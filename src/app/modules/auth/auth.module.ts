import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OktaAuthModule } from '@okta/okta-angular';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth/auth.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { LoginComponent } from './login/login.component';
import { PasswordHintsComponent } from './password-hints/password-hints.component';
import { SetPasswordComponent } from './set-password/set-password.component';

@NgModule({
  declarations: [LoginComponent, AuthComponent, LoginFormComponent, ForgotPasswordComponent, ChangePasswordComponent, SetPasswordComponent, PasswordHintsComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PopoverModule.forRoot(),
    OktaAuthModule,
    MaterialModule
  ],
  providers: [],
})
export class AuthModule {}
