import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { AppConstantService } from './app-constant.service';
import { OktaAuth } from '@okta/okta-auth-js';

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {

  socket: any;
  isSchoolAdmin: boolean;
  socketUrl: string;
  socketIoConfig: any;

  constructor(private _const: AppConstantService) {
    this.isSchoolAdmin = localStorage['UserData'] ? true : false;
    this.initSocketConfig();
  }

  initSocketConfig() {
    let socketUrl = this.getSocketUrl(this._const.WEB_SOCKET.CROWDSOURCE_NAMESPACE);
    let query: any = {};
    query.token = this.getActiveToken();

    // If soucs admin.
    if (!this.isSchoolAdmin) {
      query.accesstype = this._const.WEB_SOCKET.ACCESS_TYPE_ADMIN;
    }

    this.socketIoConfig = {
      forceNew: this._const.WEB_SOCKET.FORCE_NEW,
      upgrade: this._const.WEB_SOCKET.UPGRADE,
      reconnectionAttempts: this._const.WEB_SOCKET.RECONNECTION_ATTEMPTS,
      timeout: this._const.WEB_SOCKET.TIMEOUT,
      transports: this._const.WEB_SOCKET.TRANSPORTS,
      path: this._const.WEB_SOCKET.PATH,
      query: query
    };
    this.socket = io(socketUrl, this.socketIoConfig);
  }

  // Socket Event Handler.i.e. Receiving a new message from server.
  listen(eventName: string) {
    return new Observable(subscriber => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });

      this.socket.on(this._const.WEB_SOCKET.CONNECT, () => { });

      this.socket.on(this._const.WEB_SOCKET.CONNECT_ERROR, err => this.handleErrors(this._const.WEB_SOCKET.CONNECT_ERROR, err))
      this.socket.on(this._const.WEB_SOCKET.CONNECT_FAILED, err => this.handleErrors(this._const.WEB_SOCKET.CONNECT_FAILED, err))
      this.socket.on(this._const.WEB_SOCKET.DISCONNECT, err => this.handleErrors(this._const.WEB_SOCKET.DISCONNECT, err))
    });
  }

  // Socket Event Emitter. i.e. Send a new message to server using 
  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }

  // Handle an error occured
  handleErrors(errorType, err) {
    console.log(`Socket<${errorType}>:--> ${err}`);
  }

  // Testing with handshake event 
  testEvent() {
    this.listen(this._const.WEB_SOCKET.HANDSHAKE_EVENT).subscribe((data) => {
    });
  }

  // Get an active token of soucs admin / school admin.
  getActiveToken() {
    let token = '';
    if (this.isSchoolAdmin) {
      let strUserData = localStorage['UserData'];
      if (strUserData) {
        // School Admin
        let jsonUserData = JSON.parse(strUserData);
        if (jsonUserData && jsonUserData['_token']) {
          token = jsonUserData['_token'];
        }
      }
    } else {
      // Soucs admin.
      let oktaAuth = new OktaAuth(environment.OKTA_CONFIGURATION);
      token = oktaAuth.getAccessToken();
    }
    return token;
  }

  getSocketUrl(socketNamespace) {
    let url = environment.WEB_SOCKET_BASE_URL + socketNamespace;
    return url;
  }
}
