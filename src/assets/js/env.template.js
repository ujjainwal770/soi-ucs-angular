(function (window) {
    window.__env = window.__env || {};

    window.__env.APP_URL = `${APP_URL}`;
    window.__env.API_URL = `${API_URL}`;
    window.__env.WEB_SOCKET_BASE_URL = `${WEB_SOCKET_BASE_URL}`;
    window.__env.UPLOAD_API_URL = `${UPLOAD_API_URL}`;
    window.__env.ACTIVE_ENVIRONMENT = `${ACTIVE_ENVIRONMENT}`;

    window.__env.FIR_CONF_API_KEY = `${FIR_CONF_API_KEY}`;
    window.__env.FIR_CONF_AUTH_DOMAIN = `${FIR_CONF_AUTH_DOMAIN}`;
    window.__env.FIR_CONF_PROJECT_ID = `${FIR_CONF_PROJECT_ID}`;
    window.__env.FIR_CONF_STORAGE_BUCKET = `${FIR_CONF_STORAGE_BUCKET}`;
    window.__env.FIR_CONF_MESSAGING_SENDER_ID = `${FIR_CONF_MESSAGING_SENDER_ID}`;
    window.__env.FIR_CONF_APP_ID = `${FIR_CONF_APP_ID}`;
    window.__env.FIR_CONF_MEASUREMENT_ID = `${FIR_CONF_MEASUREMENT_ID}`;
    window.__env.FIR_CONF_VAPID_KEY = `${FIR_CONF_VAPID_KEY}`;

    window.__env.OKTA_ISSUER = `${OKTA_ISSUER}`;
    window.__env.OKTA_CLIENT_ID = `${OKTA_CLIENT_ID}`;
    window.__env.API_SUBSCRIPTION_KEY = `${API_SUBSCRIPTION_KEY}`;
    window.__env.CONTAINER_URL = `${CONTAINER_URL}`;
})(this);