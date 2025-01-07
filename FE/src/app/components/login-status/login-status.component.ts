import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrl: './login-status.component.scss',
})
export class LoginStatusComponent implements OnInit {
  isAuthenticated: boolean = false;
  userFullName: string = '';
  storage: Storage = sessionStorage;
  constructor(
    private otkaAuthService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth
  ) {}
  ngOnInit(): void {
    this.otkaAuthService.authState$.subscribe((result) => {
      this.isAuthenticated = result.isAuthenticated!;
      this.getUserDetails();
    });
  }
  getUserDetails() {
    if (this.isAuthenticated) {
      this.oktaAuth.getUser().then((res) => {
        this.userFullName = res.name as string;
        // Retrieve the use email from authentication response
        const email = res.email;

        // Store the email in browser storage
        this.storage.setItem('userEmail', JSON.stringify(email));
      });
    }
  }

  logout() {
    this.oktaAuth.signOut();
  }
}
