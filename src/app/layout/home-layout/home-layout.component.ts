/**
 * Title: Home Layout Component
 * Description: This component is responsible for displaying the layout of the home page
 */
import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { getRoleByEmailQuery } from '../../core/query/admin';
import { AuthService } from '../../core/services/auth.service';
import { CustomErrorHandlerService } from '../../core/services/custom-error-handler.service';
import { LocalStorageService } from '../../core/services/local-storage.service';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.scss']
})
export class HomeLayoutComponent implements OnInit {
  opened = true;
  // [Static for now] - Role wise - all applicable navigation menus.
  navItemsAsPerRole = [{
    'roleName': 'Super Admin',
    'allowed_nav_item_names': ['all']
  }, {
    'roleName': 'Content Manager',
    'allowed_nav_item_names': ['dashboard', 'content']
  }];

  applicableNavItemNames = ['dashboard'];
  // Flag to track if role data is fetched
  isRolefetched: boolean;
  // Flag to track if user is a school admin
  isSchoolAdmin: boolean;
  constructor(
    private readonly _apollo: Apollo,
    public _authService: AuthService,
    private readonly _spinner: NgxSpinnerService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _localStorage: LocalStorageService
  ) { }

  ngOnInit(): void {
    //get admin details from local
    this.isSchoolAdmin = this._localStorage.isSchoolAdmin();
    if (this.isSchoolAdmin) {
      // When school admin, set applicableNavItemNames to 'all'
      this.applicableNavItemNames = ['all'];
      this.isRolefetched = true;
    } else {
      // When not a school admin, fetch role by auth token
      this.getRoleByAuthToken();
    }
  }

  getRoleByAuthToken() {
    // Show spinner while fetching role data
    this._spinner.show();
    this._apollo
      .query({
        query: getRoleByEmailQuery,
        variables: {},
        fetchPolicy: 'no-cache',
      }).subscribe(({ data }) => {
        // Hide spinner after data is fetched
        this._spinner.hide();
        const dt = data['getRoleByEmail'];
        // Set applicable nav items based on role
        this.setApplicableNavItemsName(dt.roleName);
      }, error => {
        // Hide spinner on error
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
        this._authService.logout();
      });
  }

  setApplicableNavItemsName(activeRole) {
    const navMenuItem = this.navItemsAsPerRole.find(item => item.roleName === activeRole);
    if (navMenuItem) {
      // Set applicable nav items based on role
      this.applicableNavItemNames = navMenuItem['allowed_nav_item_names'];
      this.isRolefetched = true;
    } else {
      this._authService.logout();
    }
  }
}
