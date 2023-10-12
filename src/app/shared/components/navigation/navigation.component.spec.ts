import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { OktaAuthModule, OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import mockValues from 'src/app/core/constants/mock.values';
import { AppSettingsService } from 'src/app/core/services/app-settings.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { HttpService } from 'src/app/core/services/http.service';
import { NavigationComponent } from './navigation.component';

const oktaAuth = new OktaAuth(mockValues.oktaConfig);
describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;
  let settings: AppSettingsService;
  let _authService: AuthService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NavigationComponent],
      imports: [
        NoopAnimationsModule,
        LayoutModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatToolbarModule,
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        HttpClientTestingModule,
        OktaAuthModule
      ],
      providers: [ToastrService, AuthService, AppSettingsService, HttpService,
        { provide: OKTA_CONFIG, useValue: { oktaAuth } }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    settings = TestBed.inject(AppSettingsService);
    _authService = TestBed.inject(AuthService);
    spyOn(component, 'setSchoolAdminNavItems').and.callThrough();
    spyOn(component, 'setSoucsAdminNavItems').and.callThrough();

  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });

  it('should call getData() from ngOnInit()', () => {
    spyOn(component, 'getData');
    component.ngOnInit();
    expect(component.getData).toHaveBeenCalled();
  });

  xit('should check #getData() - when school admin', () => {
    let isSchoolAdmin = true;
    const mockJsonData = [
      { "module": "Dashboard", "access": "all" },
      { "module": "Student", "access": "SchoolAdmin" }
    ];
    component.getData(isSchoolAdmin);
    spyOn(settings, 'getJSON').and.returnValue(of(mockJsonData));
    settings.getJSON().subscribe((data) => {
      expect(component.setSchoolAdminNavItems).toHaveBeenCalled();
    });
  });

  xit('should check #getData() - when soucs admin ', () => {
    let isSchoolAdmin = false;
    const mockJsonData = [
      { "module": "Dashboard", "access": "all" }
    ];
    component.getData(isSchoolAdmin);
    spyOn(settings, 'getJSON').and.returnValue(of(mockJsonData));
    expect(component.setSoucsAdminNavItems).toHaveBeenCalled();
    // settings.getJSON().subscribe((data) => {
      
    // });
  });

  it('should check #setSchoolAdminNavItems() - When school Admin', () => {
    let data = [
      { "module": "Dashboard", "access": "all" },
      { "module": "Student", "access": "SchoolAdmin" }
    ];
    component.setSchoolAdminNavItems(data);
    expect(component.navMenus).toEqual(data);
  });

  it('should check #setSchoolAdminNavItems() - When not school Admin', () => {
    let data = [
      { "module": "School", "access": "Soucsadmin" }
    ];
    component.navMenus = [];
    component.setSchoolAdminNavItems(data);
    expect(component.navMenus).toEqual([]);
  });

  it('should check #setSoucsAdminNavItems() - when this.navMenus.length < 1', () => {
    let data = [
      { "module": "Dashboard", "access": "all" },
      { "module": "School", "access": "Soucsadmin" }
    ];
    component.navMenus = [];
    component.applicableNavItemNames = ["all"];
    component.setSoucsAdminNavItems(data);
    expect(component.navMenus).toEqual(data);
  });

  it('should check #setSoucsAdminNavItems() - this.navMenus.length >= 1', () => {
    let data = [
      { "module": "Dashboard", "access": "all" },
      { "module": "School", "access": "Soucsadmin" }
    ];
    component.navMenus = [{ "module": "Dashboard", "access": "all" }];
    component.setSoucsAdminNavItems(data);
    expect(component.navMenus).not.toEqual(data);
  });

  it('should check #setSoucsAdminNavItems() - when applicableNavItemNames not available', () => {
    let data = [
      { "module": "Dashboard", "access": "all" },
      { "module": "School", "access": "Soucsadmin" }
    ];
    component.navMenus = [];
    component.applicableNavItemNames = [];
    component.setSoucsAdminNavItems(data);
    expect(component.navMenus).not.toEqual(data);
  });
});
