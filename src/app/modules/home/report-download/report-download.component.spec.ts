import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { OktaAuthModule, OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import mockValues from 'src/app/core/constants/mock.values';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogsService } from 'src/app/core/services/dialog-service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { ReportDownloadComponent } from './report-download.component';
const oktaAuth = new OktaAuth(mockValues.oktaConfig);

class MatDialogMock {
  open() {
    return {
      afterClosed: () => of({ data: 'returned data' })
    }
  }
}

describe('ReportDownloadComponent', () => {
  let component: ReportDownloadComponent;
  let fixture: ComponentFixture<ReportDownloadComponent>;
  let _authService: AuthService;
  let _dialogsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportDownloadComponent],
      imports: [
        OktaAuthModule,
        MaterialModule,
        RouterTestingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ApolloTestingModule,
        ReactiveFormsModule,
        MatDialogModule
      ],
      providers: [
        NgxSpinnerService,
        LocalStorageService,
        ToastrService,
        AuthService,
        DialogsService,
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
    fixture = TestBed.createComponent(ReportDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    _dialogsService = TestBed.inject(DialogsService);
    _authService = TestBed.inject(AuthService);
    spyOn(component, 'onDownloadClicked').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check #ngOnInit()', () => {
    const mockAuthData = {
      email: "devioit@yopmail.com",
      name: "Devi",
      schoolid: 45,
      usertype: "SchoolAdmin"
    };
    component.ngOnInit();
    (_authService as any).user = of(mockAuthData);
    _authService.user.subscribe(res => {
      expect(res.schoolid).toBe(45);
    });
  });
  it('should check #ngOnInit()', () => {
    const mockAuthData = {
      email: "devioit@yopmail.com",
      name: "Devi",
      schoolid: 45,
    };
    component.ngOnInit();
    (_authService as any).user = of(mockAuthData);
    _authService.user.subscribe(res => {
      expect(res.schoolid).toBe(45);
    });
  });

  it('should call #onDownloadClicked()', () => {
    let res = undefined;
    let reportType = "NO_OF_TIMES_CHALLENGE_PLAYED_REPORT";
    spyOn(_dialogsService, 'reportDownloadPopUp').and.returnValue(of(res));
    component.onDownloadClicked(reportType);
    expect(_dialogsService.reportDownloadPopUp).toHaveBeenCalled();
  });

});
