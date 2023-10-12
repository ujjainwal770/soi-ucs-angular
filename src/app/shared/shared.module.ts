import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OktaAuthModule, OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { environment } from 'src/environments/environment';
import { HeaderComponent } from './components/header/header.component';
import { MenuListItemComponent } from './components/navigation/menu-list-item/menu-list-item.component';
import { NavigationComponent } from './components/navigation/navigation.component';

import { MaterialModule } from './module/material/material.module';
const oktaAuth = new OktaAuth(environment.OKTA_CONFIGURATION);

@NgModule({
  declarations: [NavigationComponent, HeaderComponent, MenuListItemComponent],
  exports: [NavigationComponent, HeaderComponent],
  imports: [
    CommonModule,
    RouterModule,
    OktaAuthModule,
    MaterialModule,
  ],
  providers: [
    {
      provide: OKTA_CONFIG,
      useValue: { oktaAuth },
    },
  ],
})
export class SharedModule {}