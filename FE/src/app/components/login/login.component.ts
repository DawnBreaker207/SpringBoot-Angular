import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import OktaSignIn from '@okta/okta-signin-widget';
import myAppConfig from '../../config/my-app-config';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  oktaSignin: any;
  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {
    this.oktaSignin = new OktaSignIn({
      logo: 'assets/images/logo.png',
      baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0],
      clientId: myAppConfig.oidc.clientId,
      redirectUri: myAppConfig.oidc.redirectUri,
      authParams: {
        pkce: true,
        issuer: myAppConfig.oidc.issuer,
        scopes: myAppConfig.oidc.scopes,
      },
      features: {
        registration: true,
      },
    });
  }
  ngOnInit(): void {
    this.oktaSignin
      .renderEl({
        el: '#okta-sign-in-widget',
      })
      .then((res: any) => {
        if (res.status === 'SUCCESS') {
          this.oktaAuth.signInWithRedirect();
        }
      })
      .catch((err: any) => {
        throw err;
      });
  }
  ngOnDestroy(): void {
    this.oktaSignin.remove();
  }
}
