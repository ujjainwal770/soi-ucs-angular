import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AppSettingsService } from 'src/app/core/services/app-settings.service';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from 'src/app/core/services/auth.service';
import * as _ from 'lodash';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
  @ViewChild('sidenav') public sidenav: MatSidenav;
  @Input() applicableNavItemNames;
  showFiller = true;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
  navMenus = [];
  soucsAdminMenuList = [];
  isExpanded: boolean;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public route: Router,
    public settings: AppSettingsService,
    public _authService: AuthService,
    private readonly _localStorage: LocalStorageService
  ) { }

  ngOnInit() {
    let isSchoolAdmin = this._localStorage.isSchoolAdmin();
    this.getData(isSchoolAdmin)

  }
  
  getData(isSchoolAdmin) {
    this.settings.getJSON().subscribe((data) => {
      if (isSchoolAdmin) {
        this.setSchoolAdminNavItems(data);
      } else {
        this.setSoucsAdminNavItems(data);
      }
    });
  }

  setSchoolAdminNavItems(data) {
    _.forEach(data, item => {
      if (item.access === 'SchoolAdmin' || item.access === 'all') {
        this.navMenus.push(item);
      }
    })
  }

  setSoucsAdminNavItems(data) {
    if (this.navMenus.length < 1) {
      _.forEach(data, item => {
        if (
          (
            (this.applicableNavItemNames && this.applicableNavItemNames.length > 0 && (this.applicableNavItemNames.indexOf(item.name) > -1 ||
              this.applicableNavItemNames.indexOf('all') > -1))
          ) && (
            (item.access === 'Soucsadmin' || item.access === 'all')
          )
        ) {
          this.navMenus.push(item);
        }
      })
    }
  }
}
