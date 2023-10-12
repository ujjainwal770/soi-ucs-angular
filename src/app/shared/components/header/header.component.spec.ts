import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { OktaAuthModule, OktaAuthStateService, OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrModule, ToastrService } from 'ngx-toastr';
import mockValues from 'src/app/core/constants/mock.values';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogsService } from 'src/app/core/services/dialog-service';
import { NavService } from 'src/app/core/services/nav.service';
import { ProfileComponent } from 'src/app/modules/home/profile/profile.component';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { HeaderComponent } from './header.component';

const oktaAuth = new OktaAuth(mockValues.oktaConfig);

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let okta: OktaAuthStateService;
  let authService: AuthService;
  let spinner: NgxSpinnerService;
  let localStore;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [OktaAuthModule, ToastrModule.forRoot(),
        RouterTestingModule.withRoutes([
          { path: 'view-profile', component: ProfileComponent }
        ]), MatMenuModule, BrowserAnimationsModule],
      providers: [
        NgxSpinnerService,
        LocalStorageService,
        ToastrService,
        DialogsService,
        NavService,
        AuthService,
        {
          provide: OKTA_CONFIG,
          useValue: { oktaAuth }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    localStore = {};

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    authService = TestBed.inject(AuthService);
    spinner = TestBed.inject(NgxSpinnerService);
    router = TestBed.inject(Router);

    let data = {};
    const myLocalStorage = {
      getItem: (key: string): string => {
        return key in data ? data[key] : null;
      },
      setItem: (key: string, value: string) => {
        data[key] = `${value}`;
      },
      removeItem: (key: string) => {
        delete data[key];
      }
    };

    spyOn(localStorage, 'getItem')
      .and.callFake(myLocalStorage.getItem);
    spyOn(localStorage, 'setItem')
      .and.callFake(myLocalStorage.setItem);
    spyOn(localStorage, 'removeItem')
      .and.callFake(myLocalStorage.removeItem);

    localStorage.setItem('localStorageKey', 'okta-cache-storage');
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  // it('should call ngOnInit()', () => {
  //   const mockAuthData = {
  //     email: "devioit@yopmail.com",
  //     name: "Devi",
  //     schoolid: 45,
  //     usertype: "SchoolAdmin"
  //   };
  //   component.ngOnInit();
  //   fixture.detectChanges();
  //   (authService as any).user = of(mockAuthData);
  //   authService.user.subscribe(res => {
  //     expect(res).toEqual(mockAuthData);
  //   });
  // });

  // it('should call logout()', fakeAsync(() => {
  //   spyOn(spinner, "show").and.callThrough();
  //   spinner.show();
  //   expect(spinner.show).toHaveBeenCalled();
  //   // component.logout();
  //   // authService.user.subscribe(res => {
  //   //   console.log("dilip", res);
  //   //   localStorage.removeItem('okta-cache-storage');
  //   // })
  //   // let token = localStorage.getItem('okta-cache-storage');
  //   // expect(token).toBe(null);
  //   flush();
  // }));

  // it('should call viewProfile()', () => {
  //   const spy = spyOn(router, 'navigateByUrl');
  //   component.viewProfile();
  //   const url = spy.calls.first().args[0];
  //   expect(url).toBe('/view-profile');
  // });
});
