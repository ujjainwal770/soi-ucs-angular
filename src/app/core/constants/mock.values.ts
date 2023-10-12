export default {
    // Mock Okta configuration
   oktaConfig: {
        issuer: 'https://dev-test.okta.com/oauth2/default',
        clientId: 'test-id-waL9SubnT5d7',
        redirectUri: window.location.origin + '/login/callback',
        scopes: ['openid', 'profile', 'email'],
        testing: { disableHttpsCheck: false }
    }
};