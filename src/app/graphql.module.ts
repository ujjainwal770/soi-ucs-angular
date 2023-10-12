import { NgModule } from '@angular/core';
import { ApolloLink, createHttpLink, InMemoryCache } from '@apollo/client/core';
import { OktaAuth } from '@okta/okta-auth-js';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { environment } from 'src/environments/environment';


const url = environment.API_URL; // <-- add the URL of the GraphQL server here
let userData = localStorage.getItem('UserData');
let token: any;

const authLink = new ApolloLink((operation, forward) => {
  userData = localStorage.getItem('UserData');
  let oktaAuth = new OktaAuth(environment.OKTA_CONFIGURATION);

  // Use the setContext method to set the HTTP headers.
  if (userData) {
    token = `Bearer ${JSON.parse(userData)['_token']}`;
  } else {
    try {
      token = oktaAuth.getAccessToken();
    } catch (e) {
      token = "";
    }
  }

  let subscriptionKey = environment.API_SUBSCRIPTION_KEY;
  operation.setContext({
    headers: {
      Authorization: token,
      'Ocp-Apim-Subscription-Key': subscriptionKey
    }
  });

  // Call the next link in the middleware chain.
  return forward(operation);
});

export function createApollo(httpLink: HttpLink, oktaAuth: OktaAuth) {
  /*
    Note:
      Please keep this in mind when generating okta JWT for either developer/corporate account we need to user getAccessToken(), instead of getIdToken(),
      because backend expecting access_token, while getIdToken will return id_token
  */

  token = oktaAuth.getAccessToken();
  if (localStorage.getItem('adminType') === 'school_admin') {
    token = `Bearer ${localStorage.getItem('accesstoken')}`;
  }
  return {
    link: authLink.concat(createHttpLink({ uri: url })),
    cache: new InMemoryCache()
  };
}

@NgModule({
  exports: [HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, OktaAuth],
      //deps: [myHttpLink],
    },
  ],
})

export class GraphQLModule { }
