import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './core/services/auth.service';
import { PushNotificationService } from './core/services/push-notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'soucs';

  constructor(
    private _authService: AuthService,
    private _pushNotificationService: PushNotificationService
  ) { }

  ngOnInit() {
    console.log('App Version: ', environment.APP_VERSION);
    
    const octaUser = localStorage.getItem('okta-token-storage');
    if (octaUser) {
      this._authService.checkOctaAdminLogin();
    } else {
      this._authService.checkSoucsAdminLogin();
    }

    this._pushNotificationService.requestNotifyPermission();
    this._pushNotificationService.listenPushNotification();
  }
}
