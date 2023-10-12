import * as CryptoJS from 'crypto-js';
let envVar = window["__env"] || {};

function decrypt(data: string) {
  const secretKey = '!n@dev2023';
  try {
    if (CryptoJS.AES.decrypt(data, secretKey)) {
      const decrypted = CryptoJS.AES.decrypt(data, secretKey).toString(CryptoJS.enc.Utf8);
      return decrypted;
    } else {
      return data;
    }
  } catch (e) {
    // console.log(e);
  }
}

export const environment = {
  production: true,
  APP_VERSION: "2.20.4",
  APP_URL: decrypt(envVar.APP_URL),
  API_URL: decrypt(envVar.API_URL),
  WEB_SOCKET_BASE_URL: decrypt(envVar.WEB_SOCKET_BASE_URL),
  UPLOAD_API_URL: decrypt(envVar.UPLOAD_API_URL),
  ACTIVE_ENVIRONMENT: decrypt(envVar.ACTIVE_ENVIRONMENT),
  API_SUBSCRIPTION_KEY: decrypt(envVar.API_SUBSCRIPTION_KEY),
  CONTAINER_URL: decrypt(envVar.CONTAINER_URL),

  FIREBASE_CONFIGURATION: {
    apiKey: decrypt(envVar.FIR_CONF_API_KEY),
    authDomain: decrypt(envVar.FIR_CONF_AUTH_DOMAIN),
    projectId: decrypt(envVar.FIR_CONF_PROJECT_ID),
    storageBucket: decrypt(envVar.FIR_CONF_STORAGE_BUCKET),
    messagingSenderId: decrypt(envVar.FIR_CONF_MESSAGING_SENDER_ID),
    appId: decrypt(envVar.FIR_CONF_APP_ID),
    measurementId: decrypt(envVar.FIR_CONF_MEASUREMENT_ID),
    vapidKey: decrypt(envVar.FIR_CONF_VAPID_KEY)
  },

  OKTA_CONFIGURATION: {
    issuer: decrypt(envVar.OKTA_ISSUER),
    clientId: decrypt(envVar.OKTA_CLIENT_ID),
    redirectUri: window.location.origin + '/login/callback',
    scopes: ['openid', 'profile', 'email'],
    testing: { disableHttpsCheck: false }
  },
};